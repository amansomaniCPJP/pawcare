-- Sample data: the rows below are copied unchanged from the Lab 7 document.
-- (Column lists were added because PET/ADOPTION have extra optional columns for the frontend.)
INSERT INTO PET (pet_id, name, age, breed, gender, health_status) VALUES
(1, 'Bruno', 3, 'Labrador', 'Male', 'Healthy'),
(2, 'Luna', 2, 'Golden Retriever', 'Female', 'Healthy'),
(3, 'Rocky', 4, 'German Shepherd', 'Male', 'Under Treatment'),
(4, 'Milo', 1, 'Beagle', 'Male', 'Healthy'),
(5, 'Bella', 5, 'Pug', 'Female', 'Needs Care'),
(6, 'Coco', 2, 'Persian Cat', 'Female', 'Healthy'),
(7, 'Max', 3, 'Indie', 'Male', 'Healthy'),
(8, 'Daisy', 1, 'Labrador', 'Female', 'Under Treatment');
INSERT INTO ADOPTER VALUES
(101, 'Amit Sharma', '9876543210', 'amit@gmail.com', 'Mumbai'),
(102, 'Sneha Patil', '9876543211', 'sneha@gmail.com', 'Pune'),
(103, 'Rahul Joshi', '9876543212', 'rahul@gmail.com', 'Nashik'),
(104, 'Priya Deshmukh', '9876543213', 'priya@gmail.com', 'Mumbai'),
(105, 'Neha Kulkarni', '9876543214', 'neha@gmail.com', 'Thane');
INSERT INTO ADOPTION (adoption_id, pet_id, adopter_id, adoption_date, adoption_status) VALUES
(1001, 1, 101, '2026-01-15', 'Completed'),
(1002, 2, 102, '2026-02-10', 'Completed'),
(1003, 3, 103, '2026-03-05', 'Pending'),
(1004, 4, 104, '2026-03-20', 'Completed'),
(1005, 5, 105, '2026-04-12', 'Pending');
INSERT INTO VETERINARIAN VALUES
(201, 'Dr. Mehta', 'General Veterinary', '9876500011', 'mehta@vet.com'),
(202, 'Dr. Kulkarni', 'Pet Surgery', '9876500012', 'kulkarni@vet.com'),
(203, 'Dr. Shah', 'Animal Medicine', '9876500013', 'shah@vet.com');
INSERT INTO MEDICAL_RECORD VALUES
(301, 1, 201, 'Rabies', 'Routine Checkup', 'No major history', '2026-01-10'),
(302, 2, 201, 'DHPP', 'Routine Checkup', 'Healthy', '2026-02-05'),
(303, 3, 202, 'Rabies', 'Skin Treatment', 'Skin allergy', '2026-03-01'),
(304, 4, 203, 'DHPP', 'General Checkup', 'Healthy', '2026-03-15'),
(305, 5, 202, 'Rabies', 'Dental Treatment', 'Dental issue', '2026-04-05'),
(306, 6, 201, 'FVRCP', 'Routine Checkup', 'Healthy', '2026-04-10'),
(307, 8, 203, 'Rabies', 'Infection Treatment', 'Minor infection', '2026-04-15');
INSERT INTO PET_DONATION VALUES
(401, 'Rohan Shah', '9876000011', 1, '2026-01-05'),
(402, 'Kavita Joshi', '9876000012', 2, '2026-02-01'),
(403, 'Arjun Patil', '9876000013', 3, '2026-02-20'),
(404, 'Meena Rao', '9876000014', 5, '2026-03-10'),
(405, 'Sanjay More', '9876000015', 6, '2026-04-02'),
(406, 'Pooja Shah', '9876000016', 8, '2026-04-20');

-- Extra profile details for the PawHaven frontend (optional columns on PET)
UPDATE PET SET species='Dog', size='Large', weight='28kg', location='Mumbai, MH', description='Bruno is a loyal, goofy Labrador who loves fetch and swimming. Great with kids and house-trained.', personality='["Loyal","Playful","Energetic"]', ideal_home='Active family with space to run.', images='["https://images.unsplash.com/photo-1516222338250-863216ce01ea?w=800&q=80","https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=80"]', adoption_fee=120, dob='2023-03-15', vaccinated=1, neutered=1, microchipped=1, health_notes='Healthy and up to date on vaccinations.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=1;
UPDATE PET SET species='Dog', size='Large', weight='26kg', location='Pune, MH', description='Luna is a sweet, gentle Golden Retriever who adores people and treats.', personality='["Gentle","Social","Affectionate"]', ideal_home='Family with a garden; fine with other dogs.', images='["https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80","https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80"]', adoption_fee=130, dob='2024-05-10', vaccinated=1, neutered=1, microchipped=0, health_notes='Healthy. Routine checkup done in February.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=2;
UPDATE PET SET species='Dog', size='Large', weight='32kg', location='Nashik, MH', description='Rocky is a smart, protective German Shepherd currently recovering from a skin allergy.', personality='["Loyal","Smart","Protective"]', ideal_home='Experienced owner with a fenced yard.', images='["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"]', adoption_fee=110, dob='2022-08-01', vaccinated=1, neutered=1, microchipped=1, health_notes='Under treatment for a skin allergy. Medication in progress.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=3;
UPDATE PET SET species='Dog', size='Medium', weight='11kg', location='Mumbai, MH', description='Milo is a curious Beagle puppy who follows his nose everywhere.', personality='["Curious","Playful","Food-motivated"]', ideal_home='Family who enjoys walks; secure garden needed.', images='["https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"]', adoption_fee=100, dob='2025-06-20', vaccinated=1, neutered=0, microchipped=0, health_notes='Healthy puppy. Neutering planned.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=4;
UPDATE PET SET species='Dog', size='Small', weight='9kg', location='Thane, MH', description='Bella is a cuddly senior Pug who needs a calm home and regular dental care.', personality='["Calm","Cuddly","Gentle"]', ideal_home='Quiet home, ideal for apartments.', images='["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80"]', adoption_fee=90, dob='2021-09-12', vaccinated=1, neutered=1, microchipped=0, health_notes='Needs dental care and a soft-food diet.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=5;
UPDATE PET SET species='Cat', size='Small', weight='4kg', location='Mumbai, MH', description='Coco is a fluffy Persian who enjoys sunny windows and gentle brushing.', personality='["Calm","Independent","Fluffy"]', ideal_home='Quiet indoor home; needs regular grooming.', images='["https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&q=80","https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80"]', adoption_fee=85, dob='2024-10-05', vaccinated=1, neutered=1, microchipped=0, health_notes='Healthy indoor cat.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=6;
UPDATE PET SET species='Dog', size='Medium', weight='15kg', location='Pune, MH', description='Max is a friendly, street-smart Indie dog who gets along with everyone.', personality='["Friendly","Hardy","Social"]', ideal_home='Any loving home; great with kids.', images='["https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80"]', adoption_fee=60, dob='2023-04-02', vaccinated=1, neutered=1, microchipped=0, health_notes='Healthy and robust.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=7;
UPDATE PET SET species='Dog', size='Large', weight='20kg', location='Mumbai, MH', description='Daisy is a young Labrador recovering well from a minor infection.', personality='["Playful","Friendly","Energetic"]', ideal_home='Active family; recovering, so needs gentle exercise for now.', images='["https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80","https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"]', adoption_fee=115, dob='2025-07-18', vaccinated=1, neutered=0, microchipped=0, health_notes='Recovering from a minor infection.', shelter_name='PawCare Shelter, Mumbai' WHERE pet_id=8;

-- Status timeline for the seeded adoptions
INSERT INTO ADOPTION_HISTORY (adoption_id, status, note, changed_at) VALUES
(1001, 'Pending',   'Application received.',  '2026-01-10 10:00:00'),
(1001, 'Completed', 'Adoption completed.',    '2026-01-15 12:00:00'),
(1002, 'Pending',   'Application received.',  '2026-02-05 10:00:00'),
(1002, 'Completed', 'Adoption completed.',    '2026-02-10 12:00:00'),
(1003, 'Pending',   'Application received.',  '2026-03-05 10:00:00'),
(1004, 'Pending',   'Application received.',  '2026-03-15 10:00:00'),
(1004, 'Completed', 'Adoption completed.',    '2026-03-20 12:00:00'),
(1005, 'Pending',   'Application received.',  '2026-04-12 10:00:00');

-- application dates = the dates from the document
UPDATE ADOPTION SET submitted_at = adoption_date || ' 10:00:00', updated_at = adoption_date || ' 12:00:00';
