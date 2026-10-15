# Pawhaven — Pet Adoption & Care Management System

Pawhaven is a modern, responsive React web application that connects animal rescues and shelters with prospective pet parents, while providing lifetime care management tools after adoption.

---

## 🚀 Key Features

### 1. Public Adoption Platform (`/`, `/pets`, `/pets/:petId`, `/adopt/:petId`)
- **Interactive Homepage:** Emotional hero banner, search bar, featured pet listings, 3-step adoption journey walkthrough, and care system preview.
- **Pet Discovery (`/pets`):** Live filtering by species, gender, size, and adoption status with filter chips and search.
- **Pet Profiles (`/pets/:petId`):** High-resolution photo gallery, temperament tags, medical history overview, shelter information, and direct adoption application CTAs.
- **Adoption Application (`/adopt/:petId`):** Multi-step form with client-side validation, lifestyle questions, consent declarations, and submission confirmation.
- **Knowledge Base (`/care-guide`):** Searchable educational guides on nutrition, vaccines, exercise, and bringing a pet home.
- **About & Contact (`/about`, `/contact`):** Mission background, shelter partnership information, and contact inquiry form.

### 2. Pet Owner Care Dashboard (`/app`, `/app/pets`, `/app/care`, `/app/applications`, `/app/favourites`)
- **Dashboard Overview (`/app`):** Quick metrics for registered pets, pending review counts, and today's interactive care checklist.
- **My Pets (`/app/pets`):** Register pets, view animal profiles, and launch health and routine records.
- **Care Calendar & Agenda (`/app/care`):** Schedule recurring feeding, medication, vet appointments, exercise, and grooming routines.
- **Medical & Vaccination Records (`/app/pets/:petId/health`):** Track verified clinic vaccines, preventative treatments, and exam dates.
- **Application Tracking (`/app/applications`):** Monitor adoption review stages with history timelines and withdrawal controls.
- **Saved Favourites (`/app/favourites`):** Synchronized pet bookmarking stored locally.

### 3. Shelter & Staff Administrative Portal (`/admin`, `/admin/pets`, `/admin/applications`, `/admin/users`, `/admin/reports`)
- **Admin Overview (`/admin`):** Shelter occupancy metrics, pending review queues, and adoption velocity metrics.
- **Inventory Management (`/admin/pets`):** Full CRUD modal workflows to list new pets, edit profiles, and archive adopted animals.
- **Application Review Queue (`/admin/applications`):** Examine applicant lifestyle responses, append internal staff notes, and approve or reject submissions.
- **User Management (`/admin/users`):** Account roles and user directory.
- **Reports & Analytics (`/admin/reports`):** Adoption velocity, conversion rates, and outcome breakdowns.

---

## 🎨 Design System & Visual Tokens

- **Primary Green:** `#397653` (CTAs, brand marks, active navigation)
- **Soft Mint:** `#E3F2E7` (Accents, highlighted cards, badges)
- **Butter Yellow:** `#FFE9A8` (Warm highlight banners)
- **Lavender:** `#EDE4F8` (Secondary features)
- **Coral:** `#F29A83` (Heart favourites, notification indicators)
- **Warm Cream:** `#FAF7F0` (Public page background)
- **Typography:** Nunito (Headings) and Inter (UI body, forms, dashboard tables)

---

## 🔐 Demo Credentials

Use one-click demo credentials on the login screen (`/login`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Pet Adopter** | `sarah@example.com` | `password123` |
| **Shelter Admin** | `admin@pawhaven.com` | `admin123` |

---

## 🛠 Project Structure

```text
pawhaven/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── app/
    │   └── App.jsx               # Route map and role-based guards
    ├── layouts/
    │   ├── PublicLayout.jsx       # Navbar + Footer
    │   ├── AuthLayout.jsx         # Centered authentication view
    │   ├── UserDashboardLayout.jsx# Owner sidebar + topbar
    │   └── AdminLayout.jsx        # Administrative staff portal
    ├── components/
    │   ├── ui/                    # Button, Input, Modal, Badge, Tabs, Pagination, Skeleton
    │   └── pets/                  # PetCard, PetGrid, PetGallery, PetFilterPanel, FavouriteButton
    ├── features/
    │   ├── auth/                  # AuthContext and session state
    │   └── notifications/         # Toast notification provider
    ├── pages/
    │   ├── public/                # HomePage, PetsPage, PetDetailPage, AdoptPage, CareGuide, About, Contact
    │   ├── auth/                  # LoginPage, RegisterPage, ForgotPasswordPage
    │   ├── user/                  # DashboardOverview, MyPets, CarePage, HealthRecords, Applications, Favourites
    │   └── admin/                 # AdminOverview, AdminPets, AdminApplications, AdminUsers, AdminReports
    ├── services/
    │   ├── petService.js          # Pet filtering, detail lookups, inventory CRUD
    │   ├── authService.js         # Session persistence and mock auth
    │   ├── applicationService.js  # Application submission and review status transitions
    │   ├── userService.js         # Care tasks, user pets, and health records
    │   └── mock/data.js           # Sample dataset
    └── styles/
        ├── tokens.css             # Color palette, spacing, typography scale
        └── global.css             # Resets, utilities, and animations
```
