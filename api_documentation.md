# Portfolio REST API Documentation

This API supports the Personal Portfolio Website, providing endpoints for projects, certificates, contact form submissions, and secure JWT-based admin authentication.

---

## 1. Authentication Endpoints

### Get JWT Token (Login)
Provides access and refresh token pair. Used by the Admin Dashboard to authenticate sessions.

*   **URL**: `/api/token/`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Payload**:
    ```json
    {
      "username": "admin",
      "password": "your_secure_password"
    }
    ```
*   **Success Response** (200 OK):
    ```json
    {
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Error Response** (401 Unauthorized):
    ```json
    {
      "detail": "No active account found with the given credentials"
    }
    ```

---

### Refresh JWT Token
Acquires a fresh access token using a refresh token.

*   **URL**: `/api/token/refresh/`
*   **Method**: `POST`
*   **Content-Type**: `application/json`
*   **Payload**:
    ```json
    {
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
*   **Success Response** (200 OK):
    ```json
    {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

## 2. Projects Endpoints

### List Projects
Retrieves all registered projects.
*   **URL**: `/api/projects/`
*   **Method**: `GET`
*   **Authentication**: None
*   **Success Response** (200 OK):
    ```json
    [
      {
        "id": 1,
        "title": "E-Commerce API",
        "description": "REST API with Django",
        "image": "http://localhost:8000/media/projects/banner.png",
        "image_url": "https://imgur.com/image.png",
        "image_display_url": "http://localhost:8000/media/projects/banner.png",
        "tech_stack": "React, Django, SQL",
        "tech_list": ["React", "Django", "SQL"],
        "github_link": "https://github.com/yourprofile/ecommerce",
        "live_link": "https://ecommerce-live.com",
        "created_at": "2026-07-16T13:40:00Z"
      }
    ]
    ```

### Create Project
Adds a new project.
*   **URL**: `/api/projects/`
*   **Method**: `POST`
*   **Authentication**: Admin JWT Token Required (`Authorization: Bearer <access_token>`)
*   **Content-Type**: `multipart/form-data`
*   **Payload**:
    *   `title`: string (Required)
    *   `description`: string (Required)
    *   `tech_stack`: string (Required, comma-separated, e.g. "React, Django")
    *   `image`: file (Optional, binary image file upload)
    *   `image_url`: string (Optional, external link if not uploading file)
    *   `github_link`: string (Optional URL)
    *   `live_link`: string (Optional URL)

### Update Project
Modifies an existing project.
*   **URL**: `/api/projects/<id>/`
*   **Method**: `PUT` (or `PATCH` for partial edits)
*   **Authentication**: Admin JWT Token Required (`Authorization: Bearer <access_token>`)
*   **Content-Type**: `multipart/form-data` or `application/json` (if no files are uploaded)
*   **Payload**: Same fields as Create Project.

### Delete Project
Removes a project.
*   **URL**: `/api/projects/<id>/`
*   **Method**: `DELETE`
*   **Authentication**: Admin JWT Token Required (`Authorization: Bearer <access_token>`)
*   **Success Response**: 244 No Content

---

## 3. Certifications Endpoints

### List Certificates
*   **URL**: `/api/certificates/`
*   **Method**: `GET`
*   **Authentication**: None
*   **Success Response** (200 OK):
    ```json
    [
      {
        "id": 1,
        "title": "React Developer",
        "issuing_organization": "Meta",
        "issue_date": "2026-05-15",
        "credential_id": "META-12345",
        "credential_url": "https://verify.meta.com",
        "file": "http://localhost:8000/media/certificates/cert.pdf",
        "file_url": "",
        "file_display_url": "http://localhost:8000/media/certificates/cert.pdf",
        "created_at": "2026-07-16T13:40:00Z"
      }
    ]
    ```

### Create Certificate
*   **URL**: `/api/certificates/`
*   **Method**: `POST`
*   **Authentication**: Admin JWT Token Required (`Authorization: Bearer <access_token>`)
*   **Content-Type**: `multipart/form-data`
*   **Payload**:
    *   `title`: string (Required)
    *   `issuing_organization`: string (Required)
    *   `issue_date`: date (Required, format YYYY-MM-DD)
    *   `credential_id`: string (Optional)
    *   `credential_url`: string (Optional URL)
    *   `file`: file (Optional, binary PDF/image file upload)
    *   `file_url`: string (Optional URL)

### Delete Certificate
*   **URL**: `/api/certificates/<id>/`
*   **Method**: `DELETE`
*   **Authentication**: Admin JWT Token Required
*   **Success Response**: 244 No Content

---

## 4. Contact Message Endpoints

### Submit Message
Sends a message from the landing page.
*   **URL**: `/api/contact/`
*   **Method**: `POST`
*   **Authentication**: None (Open to the public)
*   **Content-Type**: `application/json`
*   **Payload**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Collaboration Opportunity",
      "message": "Hi Shuchitha, I saw your portfolio and would love to collaborate..."
    }
    ```
*   **Success Response** (201 Created):
    ```json
    {
      "id": 5,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Collaboration Opportunity",
      "message": "Hi Shuchitha...",
      "created_at": "2026-07-16T13:58:00Z",
      "read_status": false
    }
    ```

### List Submitted Messages
Retrieves all sent inquiries.
*   **URL**: `/api/contact/`
*   **Method**: `GET`
*   **Authentication**: Admin JWT Token Required
*   **Success Response** (200 OK): Array of message objects.

### Toggle Message Read/Unread Status
Updates whether a message has been read by the admin.
*   **URL**: `/api/contact/<id>/`
*   **Method**: `PATCH`
*   **Authentication**: Admin JWT Token Required
*   **Payload**:
    ```json
    {
      "read_status": true
    }
    ```

### Delete Message
Removes an inquiry from the database.
*   **URL**: `/api/contact/<id>/`
*   **Method**: `DELETE`
*   **Authentication**: Admin JWT Token Required
*   **Success Response**: 244 No Content
