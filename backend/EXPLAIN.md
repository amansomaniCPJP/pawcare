# What we built (for the group explanation)

## 1. Stack, in one line
Python **Flask** (web server / REST API) + **SQLite** (database). The tables are the 6 from our Lab 7 doc (PET, ADOPTER, ADOPTION, VETERINARIAN, MEDICAL_RECORD, PET_DONATION), same columns and same sample data. SQL is plain, so it ports to MySQL with tiny changes.

## 2. How the frontend (Lovable "PawCare") maps to the DB
| Page | Tables used |
|---|---|
| Home counters | PET, ADOPTION (aggregates) |
| Pets + filters + detail | PET, ADOPTION (availability), PET_DONATION, MEDICAL_RECORD |
| Adopt form / Adoption history | ADOPTER, ADOPTION, PET (3-table JOIN) |
| Veterinarians | VETERINARIAN (+ LEFT JOIN count of records) |
| Medical | MEDICAL_RECORD JOIN PET JOIN VETERINARIAN |
| Donations | PET_DONATION, PET (LEFT JOIN / NOT IN subquery) |
The Lovable app currently runs on hard-coded data in the browser (no API calls), so these endpoints are what it should call instead.

## 3. DBMS concepts we added (exam points)
- **Constraints**: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE (email), CHECK (gender, age >= 0, status in Pending/Approved/Completed), DEFAULT.
- **Referential integrity**: `PRAGMA foreign_keys=ON`; deleting a pet that has records returns a 409 error instead of leaving orphan rows.
- **VIEW `PET_STATUS`**: availability is *derived* from ADOPTION, never stored, so it can't go out of sync (Completed -> Adopted, Approved -> Reserved, Pending -> Pending, else Available).
- **TRIGGERS** (2): block a pet from being Approved/Completed for two adopters (on INSERT and on UPDATE of status). This is business logic enforced inside the DB.
- **Indexes** on the foreign keys used in joins.
- **All Lab 7 queries** (joins, GROUP BY/HAVING, subqueries) live in `queries.py` and run live at `/api/queries/<name>` - good for demo.

## 4. Business rules in the API
- Adoption form: finds adopter by email or creates them, then inserts a **Pending** adoption. Rejects: unknown pet, pet already Approved/Completed, duplicate pending application, bad phone/email/date.
- Changing status Pending -> Approved -> Completed is a PATCH; the trigger stops double adoption (409).
- Pending does **not** make a pet unavailable (others can still apply); Approved/Completed does. This is my assumption from the frontend's "6 available" counter - change `PET_STATUS` if your group wants otherwise.

## 5. Files
schema.sql (tables, view, triggers) - seed.sql (doc's data) - queries.py (Lab 7 queries) - app.py (API) - test_api.py (8 tests, all pass) - README.md (endpoint table).

## 6. Things to be upfront about
- The frontend and the doc have different sample data (e.g. Bruno is a Labrador in the doc, a German Shepherd in Lovable). Backend uses the **doc's data**.
- The frontend is not yet wired to this API; that's a Lovable prompt/edit away ("replace the local store with fetch calls to http://localhost:5000/api/...").
- The Lovable `/admin` link goes to a 404 page; no admin endpoints were built beyond CRUD on pets/vets.

---
## Added later (images, reports, adopters)
- **Photo upload**: `POST /api/uploads` (multipart `file`) checks the extension + file signature, saves to `backend/uploads/`, and returns a URL. In the app: Admin > Pet Management > Add/Edit pet > "Upload photos".
- **GET /api/adopters**: ADOPTER LEFT JOIN ADOPTION + GROUP BY -> applications and pets adopted per adopter (Admin > Adopters).
- **GET /api/reports**: aggregate SQL (COUNT, AVG of julianday difference, GROUP BY species/month) -> Admin > Reports now shows real numbers.
- Pet page shows Veterinary History and donor (MEDICAL_RECORD + VETERINARIAN + PET_DONATION joins).
- 12 automated tests: `python3 test_api.py`.
- After pulling these changes, delete `pawcare.db` and restart the backend so the new seed (photos, dates) loads.
