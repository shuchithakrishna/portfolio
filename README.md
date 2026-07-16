# Full-Stack Personal Portfolio Website

A modern, responsive, full-stack Personal Portfolio Website. This project uses a **React (Vite) frontend** styled with **Vanilla CSS** and a **Django REST Framework (DRF)** backend with **PostgreSQL** database support (and SQLite fallback).

---

## Technical Stack
-   **Frontend**: React (Vite), React Router, Lucide Icons, Vanilla CSS (Glassmorphism & animations).
-   **Backend**: Django, Django REST Framework, SimpleJWT (JSON Web Tokens), Django CORS Headers.
-   **Database**: PostgreSQL (Production) / SQLite (Fallback for easy local development).
-   **Deployment**: Vercel/Netlify (Frontend), Render (Backend/Database).

---

## Key Features
-   **Modern UI**: Professional blue, white, and black theme with dynamic light/dark mode toggling, glassmorphic cards, and smooth micro-animations.
-   **Dynamic Projects section**: Full-text searching and tag-filtering based on project tech stack.
-   **Contact Form**: Input validations with live feedback, saving submissions directly into the PostgreSQL database.
-   **Certifications section**: Cards showcase verifying links and in-app file/PDF preview modal.
-   **Secure Admin Dashboard**: Restricted dashboard page using JWT credentials where the admin can add, edit, and delete projects or certificates (supports local files uploads and external URL links) and view user inquiries.
-   **SEO-Friendly & Responsive**: Fluid grid layouts for mobile, tablet, and desktop viewports.

---

## Folder Structure
```
portfolio/
├── backend/                  # Django backend service
│   ├── api/                  # Business logic (models, views, serializers)
│   ├── portfolio_backend/    # Settings & core routing configs
│   ├── media/                # Folder for uploaded images/PDFs
│   └── manage.py
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Shared UI (Navbar, Footer, ProtectedRoute)
│   │   ├── pages/            # View Pages (Portfolio, AdminLogin, AdminDashboard)
│   │   ├── App.jsx           # React Routing mappings
│   │   └── index.css         # Styling system & variables
│   ├── public/               # Static assets (contains profile avatar)
│   └── package.json
├── database/                 # Database setup scripts & documentation
│   └── postgresql_setup.md
├── api_documentation.md      # REST API endpoints specifications
└── README.md
```

---

## Local Setup & Development Instructions

### Prerequisite
Ensure you have **Python (v3.10+)** and **Node.js (v18+)** installed.

---

### 1. Backend Setup (Django)

1.  Navigate to the `backend/` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    # Alternatively, run:
    pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow psycopg2-binary
    ```
3.  Prepare migrations and run database sync:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
    *(By default, this will create a local `db.sqlite3` database file since no PostgreSQL settings are present in the environment variables. To connect to PostgreSQL, configure your `.env` variables as outlined in `database/postgresql_setup.md`)*
4.  Create an Admin Superuser for logging into the Admin Dashboard:
    ```bash
    python manage.py createsuperuser
    ```
    *   Set username: e.g. `admin`
    *   Set password: e.g. `adminpassword`
5.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The API service will launch at: `http://127.0.0.1:8000/`

---

### 2. Frontend Setup (React)

1.  Open a new terminal window and navigate to the `frontend/` folder:
    ```bash
    cd frontend
    ```
2.  Install npm packages:
    ```bash
    npm install
    ```
3.  Start the local development server:
    ```bash
    npm run dev
    ```
    The Vite app will open at: `http://localhost:5173/`

---

## Testing & Verifying
-   **Public Website**: Go to `http://localhost:5173/` to view the landing page, search projects, test the light/dark toggle, and submit the contact form.
-   **Admin Dashboard**: Go to `http://localhost:5173/admin/login` and log in with your superuser credentials. Try adding, updating, and deleting projects and certificates.

---

## Production Deployment Checklist

### 1. Backend on Render
-   Create a PostgreSQL database on Render.
-   Deploy the Backend as a Web Service.
-   Set Environment Variables on Render:
    ```env
    DATABASE_URL=your-postgresql-url
    SECRET_KEY=your-production-secret-key
    DEBUG=False
    ALLOWED_HOSTS=your-backend-domain.onrender.com,your-frontend-domain.vercel.app
    ```

### 2. Frontend on Vercel or Netlify
-   Deploy the frontend directory.
-   Set environment variables:
    ```env
    VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api
    ```
