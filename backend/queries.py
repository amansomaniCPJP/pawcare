"""The Lab 7 SQL queries from the project document, exposed by name.
GET /api/queries            -> list of names
GET /api/queries/<name>     -> runs the query and returns rows
"""

QUERIES = {
    # ---- basic WHERE ----
    "healthy_pets": ("Display healthy pets",
        "SELECT * FROM PET WHERE health_status = 'Healthy'"),
    "female_pets": ("Display female pets",
        "SELECT * FROM PET WHERE gender = 'Female'"),
    "pets_older_than_2": ("Display pets older than 2 years",
        "SELECT * FROM PET WHERE age > 2"),

    # ---- JOINS ----
    "pet_adoption_adopter": ("Pet + Adoption + Adopter",
        """SELECT a.adoption_id, p.name AS pet_name, ad.adopter_name,
                  a.adoption_date, a.adoption_status
           FROM ADOPTION a
           INNER JOIN PET p ON a.pet_id = p.pet_id
           INNER JOIN ADOPTER ad ON a.adopter_id = ad.adopter_id"""),
    "pet_medical_vet": ("Pet + Medical Record + Veterinarian",
        """SELECT p.name AS pet_name, v.vet_name, m.vaccination, m.treatment,
                  m.medical_history, m.record_date
           FROM MEDICAL_RECORD m
           JOIN PET p ON m.pet_id = p.pet_id
           JOIN VETERINARIAN v ON m.vet_id = v.vet_id"""),
    "pet_donation": ("Pet + Donation",
        """SELECT p.name AS pet_name, d.donor_name, d.phone, d.donation_date
           FROM PET_DONATION d JOIN PET p ON d.pet_id = p.pet_id"""),
    "all_pets_with_donation": ("All pets with donation details (LEFT JOIN)",
        """SELECT p.name AS pet_name, d.donor_name, d.donation_date
           FROM PET p LEFT JOIN PET_DONATION d ON p.pet_id = d.pet_id"""),

    # ---- AGGREGATES ----
    "total_pets": ("Total pets",
        "SELECT COUNT(*) AS total_pets FROM PET"),
    "total_completed_adoptions": ("Total completed adoptions",
        "SELECT COUNT(*) AS total_adoptions FROM ADOPTION WHERE adoption_status = 'Completed'"),
    "pets_by_gender": ("Pets by gender",
        "SELECT gender, COUNT(*) AS total FROM PET GROUP BY gender"),
    "pets_by_breed": ("Pets by breed",
        "SELECT breed, COUNT(*) AS total_pets FROM PET GROUP BY breed"),
    "adoption_status_count": ("Adoption status count",
        "SELECT adoption_status, COUNT(*) AS total FROM ADOPTION GROUP BY adoption_status"),
    "breeds_more_than_one": ("Breeds having more than 1 pet (HAVING)",
        "SELECT breed, COUNT(*) AS total_pets FROM PET GROUP BY breed HAVING COUNT(*) > 1"),

    # ---- SUBQUERIES ----
    "older_than_average": ("Pets older than average age",
        "SELECT * FROM PET WHERE age > (SELECT AVG(age) FROM PET)"),
    "oldest_pet": ("Pet having maximum age",
        "SELECT * FROM PET WHERE age = (SELECT MAX(age) FROM PET)"),
    "pets_completed_adoption": ("Pets with completed adoption",
        "SELECT * FROM PET WHERE pet_id IN (SELECT pet_id FROM ADOPTION WHERE adoption_status = 'Completed')"),
    "available_pets": ("Available pets",
        "SELECT * FROM PET WHERE pet_id NOT IN (SELECT pet_id FROM ADOPTION WHERE adoption_status = 'Completed')"),
    "pets_with_medical_records": ("Pets having medical records",
        "SELECT * FROM PET WHERE pet_id IN (SELECT pet_id FROM MEDICAL_RECORD)"),

    # ---- REPORTS ----
    "pending_adoption_details": ("Pending adoption details",
        """SELECT p.name AS pet_name, ad.adopter_name, a.adoption_date, a.adoption_status
           FROM ADOPTION a
           JOIN PET p ON a.pet_id = p.pet_id
           JOIN ADOPTER ad ON a.adopter_id = ad.adopter_id
           WHERE a.adoption_status = 'Pending'"""),
    "vet_record_count": ("Veterinarian medical record count",
        """SELECT v.vet_name, COUNT(m.record_id) AS total_records
           FROM VETERINARIAN v LEFT JOIN MEDICAL_RECORD m ON v.vet_id = m.vet_id
           GROUP BY v.vet_id, v.vet_name"""),
    "donation_count_per_pet": ("Donation count for each pet",
        """SELECT p.name AS pet_name, COUNT(d.donation_id) AS total_donations
           FROM PET p LEFT JOIN PET_DONATION d ON p.pet_id = d.pet_id
           GROUP BY p.pet_id, p.name"""),
    "dashboard_summary": ("Dashboard summary (scalar subqueries)",
        """SELECT
             (SELECT COUNT(*) FROM PET) AS total_pets,
             (SELECT COUNT(*) FROM ADOPTER) AS total_adopters,
             (SELECT COUNT(*) FROM VETERINARIAN) AS total_vets,
             (SELECT COUNT(*) FROM ADOPTION WHERE adoption_status = 'Completed') AS completed_adoptions,
             (SELECT COUNT(*) FROM ADOPTION WHERE adoption_status = 'Pending') AS pending_adoptions,
             (SELECT COUNT(*) FROM PET_DONATION) AS total_donations"""),
}
