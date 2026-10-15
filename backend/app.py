"""PawCare backend - Flask + SQLite REST API.

Run:  pip install flask  &&  python app.py      (http://localhost:5000)
The database file (pawcare.db) is created from schema.sql + seed.sql on first run.
"""
import json
import os
import re
import uuid
import sqlite3
from datetime import date

from flask import Flask, g, jsonify, request, send_from_directory

from queries import QUERIES

BASE = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get("PAWCARE_DB", os.path.join(BASE, "pawcare.db"))

app = Flask(__name__)
UPLOAD_DIR = os.environ.get("PAWCARE_UPLOADS", os.path.join(BASE, "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)
ALLOWED_IMAGES = {"jpg", "jpeg", "png", "webp", "gif"}
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024  # 6 MB per request


# ---------------------------------------------------------------- database --
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")  # SQLite needs this per connection
    return g.db


@app.teardown_appcontext
def close_db(_exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db(force=False):
    """Create tables (+ seed data) if the DB does not exist yet."""
    if force and os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    fresh = not os.path.exists(DB_PATH)
    con = sqlite3.connect(DB_PATH)
    for name in ("schema.sql", "seed.sql") if fresh else ("schema.sql",):
        with open(os.path.join(BASE, name)) as f:
            con.executescript(f.read())
    con.commit()
    con.close()


def rows(sql, params=()):
    return [dict(r) for r in get_db().execute(sql, params).fetchall()]


def one(sql, params=()):
    r = get_db().execute(sql, params).fetchone()
    return dict(r) if r else None


def insert(sql, params):
    cur = get_db().execute(sql, params)
    get_db().commit()
    return cur.lastrowid


# ---------------------------------------------------------- helpers/errors --
class ApiError(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status


@app.errorhandler(ApiError)
def handle_api_error(e):
    return jsonify(error=e.message), e.status


@app.errorhandler(413)
def handle_too_big(_e):
    return jsonify(error="Image is too large (max 6 MB)"), 413


@app.errorhandler(404)
def handle_404(_e):
    return jsonify(error="Not found"), 404


@app.errorhandler(sqlite3.IntegrityError)
def handle_integrity(e):
    msg = str(e)
    if "already adopted or reserved" in msg:
        return jsonify(error="This pet is already adopted or reserved"), 409
    if "UNIQUE" in msg:
        return jsonify(error="Duplicate value: " + msg.split(":")[-1].strip()), 409
    if "FOREIGN KEY" in msg:
        return jsonify(error="Operation violates a foreign key (referenced row missing, or row is still in use)"), 409
    return jsonify(error=msg), 400


@app.after_request
def cors(resp):  # lets the Lovable frontend call the API from another origin
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Expose-Headers"] = "X-Total-Count"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    return resp


@app.route("/api/<path:_p>", methods=["OPTIONS"])
def preflight(_p):
    return "", 204


def body(required=(), optional=()):
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ApiError("Send a JSON object body")
    missing = [f for f in required if data.get(f) in (None, "")]
    if missing:
        raise ApiError("Missing required field(s): " + ", ".join(missing))
    return {k: (data[k].strip() if isinstance(data[k], str) else data[k])
            for k in (*required, *optional) if k in data}


def check_date(value, field):
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(value)):
        raise ApiError(f"{field} must be YYYY-MM-DD")
    try:
        date.fromisoformat(value)
    except ValueError:
        raise ApiError(f"{field} is not a valid date")


def check_phone(value):
    if not re.fullmatch(r"\d{10,15}", str(value)):
        raise ApiError("phone must be 10-15 digits")


def check_email(value):
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", str(value)):
        raise ApiError("email is not valid")


def must_exist(table, col, value, label):
    if not one(f"SELECT 1 FROM {table} WHERE {col}=?", (value,)):
        raise ApiError(f"{label} {value} does not exist", 404)


def check_age(v):
    if not isinstance(v, int) or isinstance(v, bool) or v < 0 or v > 40:
        raise ApiError("age must be a whole number between 0 and 40")


def check_gender(v):
    if v not in ("Male", "Female"):
        raise ApiError("gender must be Male or Female")


# -------------------------------------------------------------------- misc --
@app.get("/")
def index():
    return jsonify(app="PawCare API", docs="see README.md",
                   endpoints=sorted({r.rule for r in app.url_map.iter_rules() if r.rule.startswith("/api")}))


@app.get("/api/health")
def health():
    return jsonify(status="ok")


# ----------------------------------------------------------- photo upload --
@app.post("/api/uploads")
def upload_image():
    """Admin 'Upload photos' button. Saves the file in backend/uploads/ and returns its URL;
    the URL is then stored in PET.images (JSON list) when the pet is saved."""
    f = request.files.get("file")
    if not f or not f.filename:
        raise ApiError("Send an image as multipart form field 'file'")
    ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
    if ext not in ALLOWED_IMAGES:
        raise ApiError("Only JPG, PNG, WEBP or GIF images are allowed")
    head = f.stream.read(12); f.stream.seek(0)  # check the real file signature, not just the extension
    if not (head[:3] == b"\xff\xd8\xff" or head[:8] == b"\x89PNG\r\n\x1a\n" or head[:6] in (b"GIF87a", b"GIF89a")
            or (head[:4] == b"RIFF" and head[8:12] == b"WEBP")):
        raise ApiError("That file is not a valid image")
    name = f"{uuid.uuid4().hex}.{ext}"
    f.save(os.path.join(UPLOAD_DIR, name))
    return jsonify(url=request.host_url.rstrip("/") + "/uploads/" + name), 201


@app.get("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.get("/api/stats")
def stats():
    """Home-page counters + the 'dashboard' scalar-subquery from the document."""
    s = one(QUERIES["dashboard_summary"][1])
    s["available_pets"] = one("SELECT COUNT(*) c FROM PET_STATUS WHERE is_available=1")["c"]
    s["approved_adoptions"] = one("SELECT COUNT(*) c FROM ADOPTION WHERE adoption_status='Approved'")["c"]
    return jsonify(s)


@app.get("/api/queries")
def list_queries():
    return jsonify([{"name": k, "title": v[0], "sql": " ".join(v[1].split())} for k, v in QUERIES.items()])


@app.get("/api/queries/<name>")
def run_query(name):
    if name not in QUERIES:
        raise ApiError("Unknown query", 404)
    title, sql = QUERIES[name]
    return jsonify(name=name, title=title, sql=" ".join(sql.split()), rows=rows(sql))


# -------------------------------------------------------------------- pets --
AGE_BANDS = {"0-1": (0, 1), "2-3": (2, 3), "4+": (4, 200)}
# public status words -> value of the derived PET_STATUS.availability column
STATUS_FILTER = {"available": ("Available", "Pending"), "pending": ("Reserved",),
                 "adopted": ("Adopted",), "archived": ("Archived",)}
JSON_COLS = ("personality", "images")
PET_FIELDS = ("name", "age", "breed", "gender", "health_status", "species", "size", "weight",
              "location", "description", "personality", "ideal_home", "images", "adoption_fee",
              "shelter_name", "dob", "vaccinated", "neutered", "microchipped", "health_notes", "is_archived")


def pet_out(row):
    """DB row -> JSON-friendly dict (JSON text columns become real lists)."""
    if row is None:
        return None
    for c in JSON_COLS:
        try:
            row[c] = json.loads(row.get(c) or "[]")
        except ValueError:
            row[c] = []
    return row


def clean_pet_fields(d, creating=False):
    """Validate + normalise the optional pet fields coming from the frontend."""
    out = dict(d)
    if "age" in out: check_age(out["age"])
    if "gender" in out: check_gender(out["gender"])
    if "dob" in out and out["dob"]: check_date(out["dob"], "dob")
    for c in JSON_COLS:
        if c in out:
            if not isinstance(out[c], list):
                raise ApiError(f"{c} must be a list")
            out[c] = json.dumps(out[c])
    for c in ("vaccinated", "neutered", "microchipped", "is_archived"):
        if c in out: out[c] = 1 if out[c] in (1, True, "1", "true") else 0
    if "adoption_fee" in out:
        if not isinstance(out["adoption_fee"], (int, float)) or out["adoption_fee"] < 0:
            raise ApiError("adoption_fee must be a number >= 0")
        out["adoption_fee"] = int(out["adoption_fee"])
    if "size" in out and out["size"] not in ("Small", "Medium", "Large"):
        raise ApiError("size must be Small, Medium or Large")
    if creating and "age" not in out:  # the admin form has no age box: derive from dob, else 1
        out["age"] = max(0, date.today().year - int(out["dob"][:4])) if out.get("dob") else 1
    return out


@app.get("/api/pets")
def list_pets():
    """Filters: search, breed, species, gender, size, age, health, status, available.
    Paging: page + limit (total count is returned in the X-Total-Count header)."""
    where, p = [], []
    q = request.args
    if q.get("search"):
        where.append("(name LIKE ? OR breed LIKE ? OR location LIKE ?)"); p += [f"%{q['search']}%"] * 3
    for col in ("breed", "species", "gender", "size"):
        if q.get(col):
            where.append(f"{col} = ? COLLATE NOCASE"); p.append(q[col])
    if q.get("health"):
        where.append("health_status = ?"); p.append(q["health"])
    if q.get("age"):
        if q["age"] not in AGE_BANDS:
            raise ApiError("age must be one of 0-1, 2-3, 4+")
        lo, hi = AGE_BANDS[q["age"]]
        where.append("age BETWEEN ? AND ?"); p += [lo, hi]
    if q.get("status"):
        if q["status"] not in STATUS_FILTER:
            raise ApiError("status must be available, pending, adopted or archived")
        vals = STATUS_FILTER[q["status"]]
        where.append(f"availability IN ({','.join('?' * len(vals))})"); p += vals
    if q.get("available", "").lower() in ("1", "true", "yes"):
        where.append("is_available = 1")
    sql = " FROM PET_STATUS" + (" WHERE " + " AND ".join(where) if where else "")
    total = one("SELECT COUNT(*) c" + sql, p)["c"]
    order = {"newest": "created_at DESC, pet_id DESC", "oldest": "created_at ASC, pet_id ASC",
             "name_asc": "name COLLATE NOCASE ASC"}.get(q.get("sort"), "pet_id")
    sql = "SELECT *" + sql + " ORDER BY " + order
    if q.get("limit"):
        try:
            limit, page = max(1, min(int(q["limit"]), 500)), max(1, int(q.get("page", 1)))
        except ValueError:
            raise ApiError("limit and page must be whole numbers")
        sql += " LIMIT ? OFFSET ?"; p += [limit, (page - 1) * limit]
    resp = jsonify([pet_out(r) for r in rows(sql, p)])
    resp.headers["X-Total-Count"] = str(total)
    return resp


@app.get("/api/pets/breeds")
def breeds():
    return jsonify([r["breed"] for r in rows("SELECT DISTINCT breed FROM PET ORDER BY breed")])


@app.get("/api/pets/<int:pet_id>")
def pet_detail(pet_id):
    """Pet page: pet + donor + medical history (3 tables in one response)."""
    pet = pet_out(one("SELECT * FROM PET_STATUS WHERE pet_id=?", (pet_id,)))
    if not pet:
        raise ApiError("Pet not found", 404)
    pet["donation"] = one("SELECT donor_name, phone, donation_date FROM PET_DONATION WHERE pet_id=?", (pet_id,))
    pet["medical_records"] = rows(
        """SELECT m.*, v.vet_name FROM MEDICAL_RECORD m JOIN VETERINARIAN v ON m.vet_id=v.vet_id
           WHERE m.pet_id=? ORDER BY m.record_date DESC""", (pet_id,))
    pet["vaccinations"] = [{"name": r["vaccination"], "date": r["record_date"]}
                           for r in pet["medical_records"] if r["vaccination"]]
    return jsonify(pet)


@app.post("/api/pets")
def create_pet():
    d = body(("name", "breed", "gender"), tuple(f for f in PET_FIELDS if f not in ("name", "breed", "gender")))
    d = clean_pet_fields(d, creating=True)
    cols = list(d)
    pid = insert(f"INSERT INTO PET({','.join(cols)}) VALUES ({','.join('?' * len(cols))})", [d[c] for c in cols])
    return jsonify(pet_out(one("SELECT * FROM PET_STATUS WHERE pet_id=?", (pid,)))), 201


@app.route("/api/pets/<int:pet_id>", methods=["PUT", "PATCH"])
def update_pet(pet_id):
    must_exist("PET", "pet_id", pet_id, "Pet")
    d = clean_pet_fields(body(optional=PET_FIELDS))
    if not d:
        raise ApiError("Nothing to update")
    sets = ", ".join(f"{k}=?" for k in d)
    get_db().execute(f"UPDATE PET SET {sets} WHERE pet_id=?", (*d.values(), pet_id))
    get_db().commit()
    return jsonify(pet_out(one("SELECT * FROM PET_STATUS WHERE pet_id=?", (pet_id,))))


@app.delete("/api/pets/<int:pet_id>")
def delete_pet(pet_id):
    must_exist("PET", "pet_id", pet_id, "Pet")
    get_db().execute("DELETE FROM PET WHERE pet_id=?", (pet_id,))  # FK error -> 409 if in use
    get_db().commit()
    return "", 204


# --------------------------------------------------------------- adopters --
@app.get("/api/adopters")
def list_adopters():
    """Adopter directory: LEFT JOIN + GROUP BY gives the number of applications per adopter."""
    return jsonify(rows("""SELECT ad.*, COUNT(a.adoption_id) AS total_applications,
              COALESCE(SUM(CASE WHEN a.adoption_status IN ('Approved','Completed') THEN 1 ELSE 0 END), 0) AS adopted_pets
           FROM ADOPTER ad LEFT JOIN ADOPTION a ON a.adopter_id = ad.adopter_id
           GROUP BY ad.adopter_id ORDER BY ad.adopter_id"""))


# ----------------------------------------------------------------- reports --
@app.get("/api/reports")
def reports():
    """Numbers for the admin Reports page - all computed with SQL aggregates."""
    c = one("""SELECT COUNT(*) AS total,
                 COALESCE(SUM(adoption_status IN ('Approved','Completed')), 0) AS finalized,
                 COALESCE(SUM(adoption_status = 'Rejected'), 0)  AS rejected,
                 COALESCE(SUM(adoption_status = 'Withdrawn'), 0) AS withdrawn,
                 COALESCE(SUM(adoption_status IN ('Pending','Under Review')), 0) AS open
               FROM ADOPTION""")
    decided = c["finalized"] + c["rejected"]
    avg = one("""SELECT AVG(julianday(a.adoption_date) - julianday(d.donation_date)) AS days
                 FROM ADOPTION a JOIN PET_DONATION d ON d.pet_id = a.pet_id
                 WHERE a.adoption_status IN ('Approved','Completed')""")["days"]
    return jsonify(
        applications=c,
        approval_rate=round(100 * c["finalized"] / decided, 1) if decided else None,
        avg_days_to_adopt=round(avg, 1) if avg is not None else None,
        by_species=rows("""SELECT p.species, COUNT(*) AS adoptions FROM ADOPTION a JOIN PET p ON a.pet_id = p.pet_id
                           WHERE a.adoption_status IN ('Approved','Completed')
                           GROUP BY p.species ORDER BY adoptions DESC"""),
        by_month=rows("""SELECT substr(adoption_date, 1, 7) AS month, COUNT(*) AS adoptions FROM ADOPTION
                         WHERE adoption_status IN ('Approved','Completed') GROUP BY month ORDER BY month"""),
        totals=one("""SELECT (SELECT COUNT(*) FROM PET) AS pets, (SELECT COUNT(*) FROM PET_DONATION) AS donations,
                             (SELECT COUNT(*) FROM VETERINARIAN) AS vets, (SELECT COUNT(*) FROM ADOPTER) AS adopters"""),
    )


# --------------------------------------------------------------- adoptions --
ADOPTION_SELECT = """SELECT a.adoption_id, a.pet_id, p.name AS pet_name, p.species AS pet_species,
        p.breed AS pet_breed, p.images AS pet_images, a.adopter_id,
        ad.adopter_name, ad.email AS adopter_email, ad.phone AS adopter_phone,
        a.adoption_date, a.adoption_status, a.answers, a.submitted_at, a.updated_at
    FROM ADOPTION a JOIN PET p ON a.pet_id=p.pet_id JOIN ADOPTER ad ON a.adopter_id=ad.adopter_id"""
STATUSES = ("Pending", "Under Review", "Approved", "Rejected", "Withdrawn", "Completed")


def adoption_out(rs):
    """Add parsed JSON, the status timeline and staff notes to adoption rows."""
    for r in rs:
        try: r["answers"] = json.loads(r.get("answers") or "{}")
        except ValueError: r["answers"] = {}
        try: r["pet_image"] = (json.loads(r.pop("pet_images") or "[]") or [""])[0]
        except ValueError: r["pet_image"] = ""
        r["status_history"] = rows("SELECT status, note, changed_at AS date FROM ADOPTION_HISTORY "
                                   "WHERE adoption_id=? ORDER BY history_id", (r["adoption_id"],))
        r["internal_notes"] = rows("SELECT staff_name, note, created_at AS date FROM ADOPTION_NOTE "
                                   "WHERE adoption_id=? ORDER BY note_id", (r["adoption_id"],))
    return rs


def adoption_by_id(adoption_id):
    return adoption_out(rows(ADOPTION_SELECT + " WHERE a.adoption_id=?", (adoption_id,)))[0]


def log_history(adoption_id, status, note):
    get_db().execute("INSERT INTO ADOPTION_HISTORY(adoption_id,status,note) VALUES (?,?,?)",
                     (adoption_id, status, note))


@app.get("/api/adoptions")
def list_adoptions():
    """Filters: status, email (the logged-in adopter), pet_id, search."""
    where, p = [], []
    q = request.args
    if q.get("status"):
        if q["status"] not in STATUSES:
            raise ApiError("status must be one of " + ", ".join(STATUSES))
        where.append("a.adoption_status=?"); p.append(q["status"])
    if q.get("email"):
        where.append("ad.email=? COLLATE NOCASE"); p.append(q["email"])
    if q.get("pet_id"):
        where.append("a.pet_id=?"); p.append(q["pet_id"])
    if q.get("search"):
        where.append("(p.name LIKE ? OR CAST(a.adoption_id AS TEXT) LIKE ?)"); p += [f"%{q['search']}%"] * 2
    sql = ADOPTION_SELECT + (" WHERE " + " AND ".join(where) if where else "") + " ORDER BY a.submitted_at DESC, a.adoption_id DESC"
    return jsonify(adoption_out(rows(sql, p)))


@app.get("/api/adoptions/<int:adoption_id>")
def get_adoption(adoption_id):
    must_exist("ADOPTION", "adoption_id", adoption_id, "Adoption")
    return jsonify(adoption_by_id(adoption_id))


@app.post("/api/adoptions")
def apply_for_adoption():
    """The 'Adoption application' form. Creates the adopter if the email is new,
    then a Pending adoption row (+ first history entry)."""
    d = body(("full_name", "phone", "email", "address", "pet_id"), ("preferred_date", "answers"))
    d["phone"] = re.sub(r"\D", "", str(d["phone"]))  # accept "(555) 234-5678"
    check_phone(d["phone"]); check_email(d["email"])
    d["preferred_date"] = d.get("preferred_date") or date.today().isoformat()
    check_date(d["preferred_date"], "preferred_date")
    if not isinstance(d.get("answers", {}), dict):
        raise ApiError("answers must be an object")
    pet = one("SELECT * FROM PET_STATUS WHERE pet_id=?", (d["pet_id"],))
    if not pet:
        raise ApiError("Pet not found", 404)
    if not pet["is_available"]:
        raise ApiError("This pet is already adopted or reserved", 409)

    adopter = one("SELECT adopter_id FROM ADOPTER WHERE email=? COLLATE NOCASE", (d["email"],))
    if adopter:
        aid = adopter["adopter_id"]
        get_db().execute("UPDATE ADOPTER SET adopter_name=?, phone=?, address=? WHERE adopter_id=?",
                         (d["full_name"], d["phone"], d["address"], aid))
    else:
        aid = insert("INSERT INTO ADOPTER(adopter_name,phone,email,address) VALUES (?,?,?,?)",
                     (d["full_name"], d["phone"], d["email"], d["address"]))
    if one("SELECT 1 FROM ADOPTION WHERE pet_id=? AND adopter_id=? "
           "AND adoption_status IN ('Pending','Under Review')", (pet["pet_id"], aid)):
        raise ApiError("You already have an open application for this pet", 409)
    adoption_id = insert("INSERT INTO ADOPTION(pet_id,adopter_id,adoption_date,adoption_status,answers) "
                         "VALUES (?,?,?, 'Pending', ?)",
                         (pet["pet_id"], aid, d["preferred_date"], json.dumps(d.get("answers", {}))))
    log_history(adoption_id, "Pending", "Application received.")
    get_db().commit()
    return jsonify(adoption_by_id(adoption_id)), 201


@app.route("/api/adoptions/<int:adoption_id>", methods=["PATCH", "PUT"])
def update_adoption_status(adoption_id):
    """Status dropdown / admin decision buttons / withdraw."""
    must_exist("ADOPTION", "adoption_id", adoption_id, "Adoption")
    d = body(("status",), ("note",))
    if d["status"] not in STATUSES:
        raise ApiError("status must be one of " + ", ".join(STATUSES))
    get_db().execute("UPDATE ADOPTION SET adoption_status=?, updated_at=CURRENT_TIMESTAMP WHERE adoption_id=?",
                     (d["status"], adoption_id))  # trigger blocks double adoption -> 409
    log_history(adoption_id, d["status"], d.get("note") or f"Status changed to {d['status']}.")
    get_db().commit()
    return jsonify(adoption_by_id(adoption_id))


@app.post("/api/adoptions/<int:adoption_id>/notes")
def add_adoption_note(adoption_id):
    must_exist("ADOPTION", "adoption_id", adoption_id, "Adoption")
    d = body(("note",), ("staff_name",))
    insert("INSERT INTO ADOPTION_NOTE(adoption_id,staff_name,note) VALUES (?,?,?)",
           (adoption_id, d.get("staff_name") or "Staff", d["note"]))
    return jsonify(adoption_by_id(adoption_id)), 201


# ----------------------------------------------------------- veterinarians --
@app.get("/api/vets")
def list_vets():
    return jsonify(rows("""SELECT v.*, COUNT(m.record_id) AS total_records
        FROM VETERINARIAN v LEFT JOIN MEDICAL_RECORD m ON v.vet_id=m.vet_id
        GROUP BY v.vet_id ORDER BY v.vet_id"""))


@app.post("/api/vets")
def create_vet():
    d = body(("vet_name", "specialization", "phone", "email"))
    check_phone(d["phone"]); check_email(d["email"])
    vid = insert("INSERT INTO VETERINARIAN(vet_name,specialization,phone,email) VALUES (?,?,?,?)",
                 (d["vet_name"], d["specialization"], d["phone"], d["email"]))
    return jsonify(one("SELECT * FROM VETERINARIAN WHERE vet_id=?", (vid,))), 201


@app.delete("/api/vets/<int:vet_id>")
def delete_vet(vet_id):
    must_exist("VETERINARIAN", "vet_id", vet_id, "Veterinarian")
    get_db().execute("DELETE FROM VETERINARIAN WHERE vet_id=?", (vet_id,))
    get_db().commit()
    return "", 204


# --------------------------------------------------------- medical records --
MED_SELECT = """SELECT m.record_id, m.pet_id, p.name AS pet_name, m.vet_id, v.vet_name,
        m.vaccination, m.treatment, m.medical_history, m.record_date
    FROM MEDICAL_RECORD m JOIN PET p ON m.pet_id=p.pet_id JOIN VETERINARIAN v ON m.vet_id=v.vet_id"""


@app.get("/api/medical-records")
def list_records():
    if request.args.get("pet_id"):  # the 'All pets' dropdown
        return jsonify(rows(MED_SELECT + " WHERE m.pet_id=? ORDER BY m.record_date DESC", (request.args["pet_id"],)))
    return jsonify(rows(MED_SELECT + " ORDER BY m.record_date DESC"))


@app.post("/api/medical-records")
def create_record():
    d = body(("pet_id", "vet_id", "record_date"), ("vaccination", "treatment", "medical_history"))
    check_date(d["record_date"], "record_date")
    must_exist("PET", "pet_id", d["pet_id"], "Pet")
    must_exist("VETERINARIAN", "vet_id", d["vet_id"], "Veterinarian")
    rid = insert("""INSERT INTO MEDICAL_RECORD(pet_id,vet_id,vaccination,treatment,medical_history,record_date)
                    VALUES (?,?,?,?,?,?)""",
                 (d["pet_id"], d["vet_id"], d.get("vaccination"), d.get("treatment"),
                  d.get("medical_history"), d["record_date"]))
    return jsonify(one(MED_SELECT + " WHERE m.record_id=?", (rid,))), 201


# --------------------------------------------------------------- donations --
DON_SELECT = """SELECT d.donation_id, d.donor_name, d.phone, d.pet_id, p.name AS pet_name, d.donation_date
    FROM PET_DONATION d JOIN PET p ON d.pet_id=p.pet_id"""


@app.get("/api/donations")
def list_donations():
    return jsonify(rows(DON_SELECT + " ORDER BY d.donation_id"))


@app.get("/api/donations/summary")
def donation_summary():
    """Bottom of the Donations page: pets with / without donation records."""
    return jsonify(
        with_donation=rows("""SELECT p.pet_id, p.name AS pet_name, d.donor_name, d.donation_date
            FROM PET p JOIN PET_DONATION d ON p.pet_id=d.pet_id ORDER BY d.donation_date"""),
        without_donation=rows("""SELECT p.pet_id, p.name AS pet_name, p.breed
            FROM PET p WHERE p.pet_id NOT IN (SELECT pet_id FROM PET_DONATION) ORDER BY p.pet_id"""))


@app.post("/api/donations")
def create_donation():
    d = body(("donor_name", "phone", "pet_id", "donation_date"))
    check_phone(d["phone"]); check_date(d["donation_date"], "donation_date")
    must_exist("PET", "pet_id", d["pet_id"], "Pet")
    did = insert("INSERT INTO PET_DONATION(donor_name,phone,pet_id,donation_date) VALUES (?,?,?,?)",
                 (d["donor_name"], d["phone"], d["pet_id"], d["donation_date"]))
    return jsonify(one(DON_SELECT + " WHERE d.donation_id=?", (did,))), 201


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), debug=True)
else:
    init_db()
