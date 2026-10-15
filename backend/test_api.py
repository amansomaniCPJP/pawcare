import os, tempfile, unittest
_tmp = tempfile.mkdtemp()
os.environ["PAWCARE_DB"] = os.path.join(_tmp, "t.db")
os.environ["PAWCARE_UPLOADS"] = os.path.join(_tmp, "up")
import app as A
from queries import QUERIES


class T(unittest.TestCase):
    def setUp(self):  # fresh seeded DB for every test
        A.init_db(force=True)
        self.c = A.app.test_client()

    def test_all_lab7_queries_run(self):
        for name in QUERIES:
            r = self.c.get(f"/api/queries/{name}")
            self.assertEqual(r.status_code, 200, name)
        self.assertEqual(len(self.c.get("/api/queries/healthy_pets").json["rows"]), 5)
        self.assertEqual(self.c.get("/api/queries/total_pets").json["rows"][0]["total_pets"], 8)
        self.assertEqual(self.c.get("/api/queries/breeds_more_than_one").json["rows"][0]["breed"], "Labrador")

    def test_stats_and_availability(self):
        s = self.c.get("/api/stats").json
        self.assertEqual((s["total_pets"], s["completed_adoptions"], s["pending_adoptions"]), (8, 3, 2))
        self.assertEqual(s["available_pets"], 5)  # 3 completed -> not available

    def test_filters(self):
        g = lambda q: self.c.get("/api/pets?" + q).json
        self.assertEqual(len(g("gender=Female")), 4)
        self.assertEqual(len(g("age=4%2B")), 2)
        self.assertEqual(len(g("age=0-1")), 2)
        self.assertEqual(len(g("available=true")), 5)
        self.assertEqual(g("search=bru")[0]["name"], "Bruno")
        self.assertEqual(self.c.get("/api/pets?age=9").status_code, 400)

    def test_pet_detail(self):
        p = self.c.get("/api/pets/1").json
        self.assertEqual(p["availability"], "Adopted")
        self.assertEqual(p["donation"]["donor_name"], "Rohan Shah")
        self.assertEqual(len(p["medical_records"]), 1)
        self.assertEqual(self.c.get("/api/pets/999").status_code, 404)

    def test_adoption_flow(self):
        form = dict(full_name="Test User", phone="9999999999", email="t@x.com",
                    address="Mumbai", preferred_date="2026-11-01", pet_id=7)
        r = self.c.post("/api/adoptions", json=form)
        self.assertEqual(r.status_code, 201); aid = r.json["adoption_id"]
        self.assertEqual(r.json["adoption_status"], "Pending")
        self.assertEqual(self.c.post("/api/adoptions", json=form).status_code, 409)  # duplicate
        self.assertEqual(self.c.post("/api/adoptions", json={**form, "pet_id": 1}).status_code, 409)  # adopted
        self.assertEqual(self.c.post("/api/adoptions", json={**form, "phone": "12"}).status_code, 400)
        r = self.c.patch(f"/api/adoptions/{aid}", json={"status": "Approved"})
        self.assertEqual(r.json["adoption_status"], "Approved")
        self.assertEqual(self.c.get("/api/pets/7").json["availability"], "Reserved")
        # second adopter for same pet is now blocked
        r2 = self.c.post("/api/adoptions", json={**form, "email": "o@x.com"})
        self.assertEqual(r2.status_code, 409)
        self.assertEqual(self.c.patch(f"/api/adoptions/{aid}", json={"status": "Bogus"}).status_code, 400)

    def test_trigger_blocks_double_completion(self):
        # Luna(2) is Completed; approving a new app for her directly must fail
        con = A.sqlite3.connect(A.DB_PATH); con.execute("PRAGMA foreign_keys=ON")
        with self.assertRaises(A.sqlite3.IntegrityError):
            con.execute("INSERT INTO ADOPTION(pet_id,adopter_id,adoption_date,adoption_status) VALUES (2,101,'2026-05-01','Approved')")
        con.close()

    def test_vets_records_donations(self):
        self.assertEqual(self.c.get("/api/vets").json[0]["total_records"], 3)
        r = self.c.post("/api/vets", json=dict(vet_name="Dr. New", specialization="Dental", phone="9000000000", email="new@vet.com"))
        self.assertEqual(r.status_code, 201)
        self.assertEqual(self.c.post("/api/vets", json=dict(vet_name="Dup", specialization="x", phone="9000000001", email="new@vet.com")).status_code, 409)
        r = self.c.post("/api/medical-records", json=dict(pet_id=7, vet_id=201, vaccination="Rabies", record_date="2026-10-01"))
        self.assertEqual(r.status_code, 201); self.assertEqual(r.json["pet_name"], "Max")
        self.assertEqual(self.c.post("/api/medical-records", json=dict(pet_id=99, vet_id=201, record_date="2026-10-01")).status_code, 404)
        self.assertEqual(len(self.c.get("/api/medical-records?pet_id=1").json), 1)
        r = self.c.post("/api/donations", json=dict(donor_name="Z", phone="9111111111", pet_id=7, donation_date="2026-10-02"))
        self.assertEqual(r.status_code, 201)
        s = self.c.get("/api/donations/summary").json
        self.assertEqual(len(s["with_donation"]), 7); self.assertEqual(len(s["without_donation"]), 1)  # only Milo left

    def test_pet_crud_and_fk(self):
        r = self.c.post("/api/pets", json=dict(name="Zed", age=2, breed="Indie", gender="Male"))
        self.assertEqual(r.status_code, 201); pid = r.json["pet_id"]
        self.assertEqual(self.c.put(f"/api/pets/{pid}", json={"health_status": "Recovering"}).json["health_status"], "Recovering")
        self.assertEqual(self.c.delete(f"/api/pets/{pid}").status_code, 204)
        self.assertEqual(self.c.delete("/api/pets/1").status_code, 409)  # has records
        self.assertEqual(self.c.post("/api/pets", json=dict(name="B", age=-1, breed="x", gender="Male")).status_code, 400)

    def test_frontend_pet_features(self):
        r = self.c.get("/api/pets?species=cat")
        self.assertEqual([p["name"] for p in r.json], ["Coco"])
        self.assertEqual(r.json[0]["images"][0][:8], "https://")  # JSON column -> list
        r = self.c.get("/api/pets?limit=3&page=2&sort=name_asc")
        self.assertEqual(len(r.json), 3); self.assertEqual(r.headers["X-Total-Count"], "8")
        self.assertEqual(len(self.c.get("/api/pets?status=adopted").json), 3)
        self.assertEqual(len(self.c.get("/api/pets?size=large").json), 4)
        self.assertEqual(len(self.c.get("/api/pets?search=mumbai").json), 4)
        # create like the admin form (no age) + archive
        r = self.c.post("/api/pets", json=dict(name="Kiwi", species="Rabbit", breed="Lop", gender="Female",
                        size="Small", location="Pune, MH", description="x", adoption_fee=40, images=["https://a/b.jpg"]))
        self.assertEqual(r.status_code, 201); pid = r.json["pet_id"]
        self.assertEqual(r.json["images"], ["https://a/b.jpg"])
        r = self.c.put(f"/api/pets/{pid}", json={"is_archived": 1})
        self.assertEqual(r.json["availability"], "Archived"); self.assertEqual(r.json["is_available"], 0)
        self.assertEqual(self.c.post("/api/adoptions", json=dict(full_name="A", phone="9999999999", email="k@x.com",
                         address="x", pet_id=pid)).status_code, 409)  # archived pets can't be adopted
        self.assertEqual(self.c.get(f"/api/pets/{pid}").json["vaccinations"], [])
        self.assertEqual(self.c.get("/api/pets/1").json["vaccinations"][0]["name"], "Rabies")

    def test_application_workflow(self):
        form = dict(full_name="Sarah J", phone="(555) 234-5678", email="sarah@example.com", address="Austin",
                    pet_id=7, answers={"livingSituation": "House", "hoursAvailable": "6"})
        r = self.c.post("/api/adoptions", json=form)
        self.assertEqual(r.status_code, 201); a = r.json; aid = a["adoption_id"]
        self.assertEqual(a["answers"]["livingSituation"], "House")
        self.assertEqual(a["status_history"][0]["status"], "Pending")
        self.assertEqual(a["pet_name"], "Max"); self.assertTrue(a["pet_image"].startswith("https://"))
        r = self.c.patch(f"/api/adoptions/{aid}", json={"status": "Under Review", "note": "Assigned."})
        self.assertEqual([h["status"] for h in r.json["status_history"]], ["Pending", "Under Review"])
        r = self.c.post(f"/api/adoptions/{aid}/notes", json={"note": "Good fit", "staff_name": "Admin"})
        self.assertEqual(r.json["internal_notes"][0]["note"], "Good fit")
        self.assertEqual(len(self.c.get("/api/adoptions?email=SARAH@example.com").json), 1)
        r = self.c.patch(f"/api/adoptions/{aid}", json={"status": "Withdrawn"})
        self.assertEqual(r.json["adoption_status"], "Withdrawn")
        self.assertEqual(self.c.get("/api/pets/7").json["availability"], "Available")  # withdrawn frees the pet
        self.assertEqual(self.c.get("/api/adoptions?status=Withdrawn").json[0]["adoption_id"], aid)

    def test_photo_upload(self):
        import io
        png = b"\x89PNG\r\n\x1a\n" + b"0" * 40
        r = self.c.post("/api/uploads", data={"file": (io.BytesIO(png), "dog.png")}, content_type="multipart/form-data")
        self.assertEqual(r.status_code, 201); url = r.json["url"]
        self.assertTrue(url.endswith(".png"))
        self.assertEqual(self.c.get(url.replace("http://localhost", "")).status_code, 200)  # served back
        bad = self.c.post("/api/uploads", data={"file": (io.BytesIO(b"MZ..."), "virus.exe")}, content_type="multipart/form-data")
        self.assertEqual(bad.status_code, 400)
        fake = self.c.post("/api/uploads", data={"file": (io.BytesIO(b"not an image"), "x.png")}, content_type="multipart/form-data")
        self.assertEqual(fake.status_code, 400)
        self.assertEqual(self.c.post("/api/uploads", json={}).status_code, 400)

    def test_reports_and_adopters(self):
        r = self.c.get("/api/reports").json
        self.assertEqual(r["applications"]["total"], 5); self.assertEqual(r["applications"]["finalized"], 3)
        self.assertEqual(r["approval_rate"], 100.0)           # 3 finalized, 0 rejected
        self.assertEqual(r["avg_days_to_adopt"], 9.5)         # Bruno 10 days, Luna 9 days (Milo has no donation row)
        self.assertEqual(r["by_species"], [{"species": "Dog", "adoptions": 3}])
        self.assertEqual(r["by_month"][0], {"month": "2026-01", "adoptions": 1})
        a = self.c.get("/api/adopters").json
        self.assertEqual(len(a), 5); self.assertEqual(a[0]["total_applications"], 1); self.assertEqual(a[2]["adopted_pets"], 0)

if __name__ == "__main__":
    unittest.main(verbosity=1)
