# Backend API Endpoints Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints (`/api/auth`)

### 1. Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 0,
    "totalCreation": 0
  }
}
```

### 2. Login User
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 0,
    "totalCreation": 0
  }
}
```

### 3. Get Current User
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 0,
    "totalCreation": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Logout User
- **Method:** `POST`
- **Path:** `/api/auth/logout`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📁 Project Endpoints (`/api/projects`)

### 1. Get User's Projects
- **Method:** `GET`
- **Path:** `/api/projects`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "project_id",
      "name": "My Website",
      "initialPrompt": "Create a portfolio website",
      "current_code": "<html>...</html>",
      "conversation": [...],
      "versions": [...],
      "isPublished": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Projects retrieved successfully"
}
```

### 2. Get Community Projects (Published)
- **Method:** `GET`
- **Path:** `/api/projects/community`
- **Access:** Public
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "project_id",
      "name": "Public Website",
      "initialPrompt": "Create a blog",
      "current_code": "<html>...</html>",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isPublished": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Community projects retrieved successfully"
}
```

### 3. Get Single Project
- **Method:** `GET`
- **Path:** `/api/projects/:id`
- **Access:** 
  - Public if project is published
  - Private (requires token + ownership) if project is not published
- **Headers (if private):** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "project_id",
    "name": "My Website",
    "initialPrompt": "Create a portfolio website",
    "current_code": "<html>...</html>",
    "conversation": [
      {
        "id": "conv_id",
        "role": "user",
        "content": "Create a portfolio website",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "conv_id",
        "role": "assistant",
        "content": "<html>...</html>",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "versions": [...],
    "isPublished": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Create Project (with AI)
- **Method:** `POST`
- **Path:** `/api/projects`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "My New Website",
  "initialPrompt": "Create a modern portfolio website with a hero section, about section, and contact form"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "project_id",
    "name": "My New Website",
    "initialPrompt": "Create a modern portfolio website...",
    "current_code": "<html>...</html>",
    "conversation": [...],
    "versions": [],
    "isPublished": false
  },
  "message": "Project created successfully"
}
```
- **Note:** This endpoint will:
  - Check if user has ≥ 5 credits
  - Generate HTML using AI (deducts 5 credits)
  - Increment user's totalCreation count

### 5. Update Project (with AI modifications)
- **Method:** `PUT`
- **Path:** `/api/projects/:id`
- **Access:** Private (requires token + ownership)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "modificationRequest": "Change the background color to blue and add a footer",
  "current_code": "<html>existing code...</html>"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "project_id",
    "name": "My Website",
    "current_code": "<html>updated code...</html>",
    "conversation": [...],
    "versions": [...]
  },
  "message": "Project updated successfully"
}
```
- **Note:** If `modificationRequest` is provided, AI will modify the code

### 6. Toggle Publish Status
- **Method:** `PATCH`
- **Path:** `/api/projects/:id/publish`
- **Access:** Private (requires token + ownership)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "project_id",
    "isPublished": true
  },
  "message": "Project published successfully"
}
```

### 7. Delete Project
- **Method:** `DELETE`
- **Path:** `/api/projects/:id`
- **Access:** Private (requires token + ownership)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 👤 User Endpoints (`/api/user`)

### 1. Get User Credits
- **Method:** `GET`
- **Path:** `/api/user/credits`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 10,
    "totalCreation": 5
  }
}
```

### 2. Get User Profile
- **Method:** `GET`
- **Path:** `/api/user/profile`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 10,
    "totalCreation": 5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Update User Credits
- **Method:** `PUT`
- **Path:** `/api/user/credits`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "credits": 20
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 20,
    "totalCreation": 5
  },
  "message": "Credits updated successfully"
}
```

### 4. Increment User Credits
- **Method:** `PATCH`
- **Path:** `/api/user/credits/increment`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "amount": 5
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 15,
    "totalCreation": 5
  },
  "message": "Credits incremented successfully"
}
```

### 5. Decrement User Credits
- **Method:** `PATCH`
- **Path:** `/api/user/credits/decrement`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "amount": 5
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 5,
    "totalCreation": 5
  },
  "message": "Credits decremented successfully"
}
```

### 6. Increment Total Creation Count
- **Method:** `PATCH`
- **Path:** `/api/user/creation/increment`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "credits": 10,
    "totalCreation": 6
  },
  "message": "Total creation incremented successfully"
}
```

### 7. Update User Profile
- **Method:** `PUT`
- **Path:** `/api/user/profile`
- **Access:** Private (requires token)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```
- **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Updated",
    "email": "johnupdated@example.com",
    "credits": 10,
    "totalCreation": 5
  },
  "message": "Profile updated successfully"
}
```

---

## 🏥 Health Check

### Health Check
- **Method:** `GET`
- **Path:** `/api/health`
- **Access:** Public
- **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 Postman Testing Tips

1. **Set up Environment Variables:**
   - `base_url`: `http://localhost:3000/api`
   - `token`: (will be set after login)

2. **Testing Flow:**
   - Start with `/api/auth/register` or `/api/auth/login`
   - Copy the `token` from response
   - Set it as an environment variable
   - Use `{{token}}` in Authorization header for protected routes

3. **Authorization Header Format:**
   ```
   Authorization: Bearer {{token}}
   ```

4. **Common Error Responses:**
   - `401 Unauthorized`: Missing or invalid token
   - `400 Bad Request`: Validation error or insufficient credits
   - `404 Not Found`: Resource doesn't exist
   - `500 Internal Server Error`: Server error

5. **Important Notes:**
   - Creating a project requires ≥ 5 credits (deducts 5 credits)
   - Project creation with AI can take 20-60 seconds
   - Frontend timeout is set to 120 seconds for AI operations
