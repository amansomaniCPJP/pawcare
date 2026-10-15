# PawCare backend (Flask + SQLite)

    pip install -r requirements.txt
    python app.py            # http://localhost:5000  (creates pawcare.db from schema.sql + seed.sql)
    python test_api.py       # 8 tests, all should pass
    # reset data: delete pawcare.db and restart

## Endpoints (JSON)
| Screen | Method & URL | Notes |
|---|---|---|
| Home counters | GET /api/stats | total/available pets, adoptions, vets, donations |
| Pets list | GET /api/pets?search=&breed=&gender=&age=0-1\|2-3\|4%2B&health=&available=true | each pet has `availability` (Available/Pending/Reserved/Adopted) |
| Breed dropdown | GET /api/pets/breeds | |
| Pet details | GET /api/pets/<id> | pet + donor + medical records |
| Pets CRUD | POST /api/pets, PUT/DELETE /api/pets/<id> | |
| Adopt form | POST /api/adoptions | body: full_name, phone, email, address, preferred_date, pet_id |
| Adoption history | GET /api/adoptions?status=Pending | |
| Status dropdown | PATCH /api/adoptions/<id> | body: {"status":"Approved"} |
| Vets | GET/POST /api/vets, DELETE /api/vets/<id> | list includes record count |
| Medical | GET /api/medical-records?pet_id=, POST /api/medical-records | |
| Donations | GET/POST /api/donations, GET /api/donations/summary | summary = pets with / without donation |
| Viva demo | GET /api/queries, GET /api/queries/<name> | runs every Lab 7 query from the doc |

Errors come back as `{"error": "..."}` with 400 (bad input), 404 (not found), 409 (conflict).
CORS is open so the Lovable frontend can call it.
