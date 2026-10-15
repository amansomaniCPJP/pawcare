# PawCare - Pet Adoption & Care Management System

DBMS Mini Project - Sardar Patel Institute of Technology, Mumbai

**Submitted by:** Aman Somani (UID 2025300246), Computer Engineering, Div D
**Group members:** Chandana Shinde, Harsh Shinde

## Links
| What | Link |
|---|---|
| Source code | https://github.com/amansomaniCPJP/pawcare |
| Deployed website (Vercel) | `https://pawcare-rose.vercel.app` |
| Backend API (Render) | https://pawcare-api-g90l.onrender.com/api/health |

> The free Render server sleeps when idle. The first request can take ~30 seconds, and the demo data resets on restart.

## What it does
A shelter system for the full life of a pet: donation -> vet check-ups -> online listing -> adoption.
Visitors browse and filter pets and apply to adopt. Admin staff review applications, manage pets, vets, medical records and donations, and see live reports.

## Tech stack
- **Frontend:** React 18, Vite, React Router
- **Backend:** Python, Flask, Gunicorn (REST API)
- **Database:** SQLite
- **Hosting:** GitHub, Render (API), Vercel (website)

## Database
Tables: `PET`, `ADOPTER`, `ADOPTION`, `VETERINARIAN`, `MEDICAL_RECORD`, `PET_DONATION` (plus `ADOPTION_HISTORY`, `ADOPTION_NOTE`).
- PK, FK, NOT NULL, UNIQUE, CHECK and DEFAULT constraints, indexes
- View `PET_STATUS` (derives Available / Pending / Reserved / Adopted / Archived)
- 2 triggers that block a pet from being adopted twice
- All Lab 7 queries (joins, GROUP BY / HAVING, subqueries) at `GET /api/queries/<name>`

Files: `backend/schema.sql`, `backend/seed.sql`, `backend/queries.py`.

## Run locally
**Backend** (port 5001)
```
cd backend
pip3 install -r requirements.txt
PORT=5001 python3 app.py
```
Check: http://localhost:5001/api/health

**Frontend** (port 5173), in a second terminal
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

**Tests:** `cd backend && python3 test_api.py` (12 tests)

## Demo logins
| Role | Email | Password |
|---|---|---|
| Adopter | sarah@example.com | password123 |
| Admin | admin@pawhaven.com | admin123 |

## Main API endpoints
`/api/pets`, `/api/adoptions`, `/api/adopters`, `/api/vets`, `/api/medical-records`, `/api/donations`, `/api/reports`, `/api/uploads`, `/api/queries/<name>`

More detail: `backend/EXPLAIN.md`
