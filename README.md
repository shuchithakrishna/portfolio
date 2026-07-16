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
