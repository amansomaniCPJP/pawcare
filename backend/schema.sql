-- PawCare : Pet Adoption & Care Management System  (DBMS mini project)
-- Tables are exactly the ones from the Lab 7 document. Added on top:
-- NOT NULL / CHECK / UNIQUE constraints, indexes, a VIEW and two TRIGGERS.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS PET (
    pet_id        INTEGER PRIMARY KEY,
    name          VARCHAR(50)  NOT NULL,
    age           INT          NOT NULL CHECK (age >= 0),
    breed         VARCHAR(50)  NOT NULL,
    gender        VARCHAR(10)  NOT NULL CHECK (gender IN ('Male','Female')),
    health_status VARCHAR(100) NOT NULL DEFAULT 'Healthy',
    -- extra profile columns used by the PawHaven frontend (all optional)
    species       VARCHAR(30)  NOT NULL DEFAULT 'Dog',
    size          VARCHAR(20)  NOT NULL DEFAULT 'Medium',
    weight        VARCHAR(20),
    location      VARCHAR(100) NOT NULL DEFAULT 'Mumbai, MH',
    description   TEXT,
    personality   TEXT NOT NULL DEFAULT '[]',   -- JSON list of tags
    ideal_home    TEXT,
    images        TEXT NOT NULL DEFAULT '[]',   -- JSON list of image URLs
    adoption_fee  INT  NOT NULL DEFAULT 100,
    shelter_name  VARCHAR(100) NOT NULL DEFAULT 'PawCare Shelter',
    dob           DATE,
    vaccinated    INT  NOT NULL DEFAULT 1,
    neutered      INT  NOT NULL DEFAULT 0,
    microchipped  INT  NOT NULL DEFAULT 0,
    health_notes  TEXT,
    is_archived   INT  NOT NULL DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ADOPTER (
    adopter_id   INTEGER PRIMARY KEY,
    adopter_name VARCHAR(50)  NOT NULL,
    phone        VARCHAR(15)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    address      VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS ADOPTION (
    adoption_id     INTEGER PRIMARY KEY,
    pet_id          INT  NOT NULL,
    adopter_id      INT  NOT NULL,
    adoption_date   DATE NOT NULL,
    adoption_status VARCHAR(30) NOT NULL DEFAULT 'Pending'
                    CHECK (adoption_status IN ('Pending','Under Review','Approved','Rejected','Withdrawn','Completed')),
    answers         TEXT NOT NULL DEFAULT '{}',   -- JSON: application form answers
    submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id)     REFERENCES PET(pet_id),
    FOREIGN KEY (adopter_id) REFERENCES ADOPTER(adopter_id)
);

CREATE TABLE IF NOT EXISTS VETERINARIAN (
    vet_id         INTEGER PRIMARY KEY,
    vet_name       VARCHAR(50)  NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone          VARCHAR(15)  NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS MEDICAL_RECORD (
    record_id       INTEGER PRIMARY KEY,
    pet_id          INT NOT NULL,
    vet_id          INT NOT NULL,
    vaccination     VARCHAR(100),
    treatment       VARCHAR(100),
    medical_history VARCHAR(200),
    record_date     DATE NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES PET(pet_id),
    FOREIGN KEY (vet_id) REFERENCES VETERINARIAN(vet_id)
);

CREATE TABLE IF NOT EXISTS PET_DONATION (
    donation_id   INTEGER PRIMARY KEY,
    donor_name    VARCHAR(50) NOT NULL,
    phone         VARCHAR(15) NOT NULL,
    pet_id        INT  NOT NULL,
    donation_date DATE NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES PET(pet_id)
);

-- status timeline of an application (one row per status change)
CREATE TABLE IF NOT EXISTS ADOPTION_HISTORY (
    history_id  INTEGER PRIMARY KEY,
    adoption_id INT NOT NULL,
    status      VARCHAR(30) NOT NULL,
    note        VARCHAR(300),
    changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adoption_id) REFERENCES ADOPTION(adoption_id) ON DELETE CASCADE
);

-- private notes staff attach to an application
CREATE TABLE IF NOT EXISTS ADOPTION_NOTE (
    note_id     INTEGER PRIMARY KEY,
    adoption_id INT NOT NULL,
    staff_name  VARCHAR(50) NOT NULL,
    note        VARCHAR(500) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adoption_id) REFERENCES ADOPTION(adoption_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_history_adoption ON ADOPTION_HISTORY(adoption_id);
CREATE INDEX IF NOT EXISTS idx_note_adoption    ON ADOPTION_NOTE(adoption_id);
CREATE INDEX IF NOT EXISTS idx_adoption_pet   ON ADOPTION(pet_id);
CREATE INDEX IF NOT EXISTS idx_medical_pet    ON MEDICAL_RECORD(pet_id);
CREATE INDEX IF NOT EXISTS idx_donation_pet   ON PET_DONATION(pet_id);

-- VIEW: every pet with its live availability (derived from ADOPTION, never stored)
DROP VIEW IF EXISTS PET_STATUS;
CREATE VIEW PET_STATUS AS
SELECT p.*,
       CASE
         WHEN p.is_archived = 1 THEN 'Archived'
         WHEN EXISTS (SELECT 1 FROM ADOPTION a WHERE a.pet_id = p.pet_id AND a.adoption_status = 'Completed') THEN 'Adopted'
         WHEN EXISTS (SELECT 1 FROM ADOPTION a WHERE a.pet_id = p.pet_id AND a.adoption_status = 'Approved')  THEN 'Reserved'
         WHEN EXISTS (SELECT 1 FROM ADOPTION a WHERE a.pet_id = p.pet_id AND a.adoption_status = 'Pending')   THEN 'Pending'
         ELSE 'Available'
       END AS availability,
       CASE WHEN p.is_archived = 1 OR EXISTS (SELECT 1 FROM ADOPTION a WHERE a.pet_id = p.pet_id
                         AND a.adoption_status IN ('Approved','Completed'))
            THEN 0 ELSE 1 END AS is_available
FROM PET p;

-- TRIGGERS: a pet can never be Approved/Completed for two adopters
DROP TRIGGER IF EXISTS trg_adoption_no_double_insert;
CREATE TRIGGER trg_adoption_no_double_insert
BEFORE INSERT ON ADOPTION
WHEN NEW.adoption_status IN ('Approved','Completed')
 AND EXISTS (SELECT 1 FROM ADOPTION WHERE pet_id = NEW.pet_id
             AND adoption_status IN ('Approved','Completed'))
BEGIN
  SELECT RAISE(ABORT, 'Pet is already adopted or reserved');
END;

DROP TRIGGER IF EXISTS trg_adoption_no_double_update;
CREATE TRIGGER trg_adoption_no_double_update
BEFORE UPDATE OF adoption_status ON ADOPTION
WHEN NEW.adoption_status IN ('Approved','Completed')
 AND EXISTS (SELECT 1 FROM ADOPTION WHERE pet_id = NEW.pet_id
             AND adoption_id <> NEW.adoption_id
             AND adoption_status IN ('Approved','Completed'))
BEGIN
  SELECT RAISE(ABORT, 'Pet is already adopted or reserved');
END;
