# PawCare - DBMS mini project (backend + frontend)

    pawcare-project/
      backend/    Flask API + SQLite database (schema.sql, seed.sql)
      frontend/   React (Vite) app "Pawhaven", already wired to the backend

## Run it (needs Python 3 and Node.js 18+; two terminals)

Terminal 1 - backend
    cd backend
    pip3 install flask
    python3 app.py                  # -> http://localhost:5001

Terminal 2 - frontend
    cd frontend
    npm install
    npm run dev                     # -> http://localhost:5173

Open http://localhost:5173
- Adopter login:  sarah@example.com / password123
- Admin login:    admin@pawhaven.com / admin123
If the backend runs on another address: create frontend/.env with  VITE_API_URL=http://localhost:5002/api

## What is stored in the database and what is not
In the database (through the API): pets, adopters, adoptions/applications (+ status history, staff notes),
veterinarians, medical records, donations (admin page "Shelter Records").
Still demo data inside the React app (no DB table): login/accounts, "My Pets", care tasks, health records of
adopters' own pets, favourites, the Users/Reports/Shelters admin screens.
