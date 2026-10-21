# Practical 7: Authentication and Middleware Pipeline

## 📦 Installation
```bash
npm install
```

## 🚀 Run Lab Runner
To walk through each step interactively and take screenshots:
```bash
npm run lab
```
To run all steps automatically:
```bash
npm run lab -- --auto
```

## 📋 What Each Step Shows
1. **STEP 1: Verify installed dependencies** - Checks `bcryptjs` and `jsonwebtoken`.
2. **STEP 2: Start Express server with User & Task schemas** - Launches backend child process.
3. **STEP 3: Register route with bcrypt** - `POST /api/auth/register`, hashes password before saving to MongoDB, returns `201 Created`.
4. **STEP 4: Login route with JWT** - `POST /api/auth/login`, compares password with `bcrypt.compare`, signs JWT token, returns `200 OK`.
5. **STEP 5: 401 without token (Negative demo)** - Requests `GET /tasks` without `Authorization` header, returns `401 Unauthorized`.
6. **STEP 6: 401 with tampered token (Negative demo)** - Requests `GET /tasks` with invalid token, caught by `jwt.verify` try/catch, returns `401 Unauthorized`.
7. **STEP 7: 400 Validation error (Negative demo)** - Requests `POST /tasks` without required title, caught by input validation middleware, returns `400 Bad Request`.
8. **STEP 8: Create task with valid JWT** - Sends `POST /tasks` with `Authorization: Bearer <token>`, returns `201 Created`.
9. **STEP 9: GET /tasks with valid JWT** - Returns tasks belonging to the authenticated user.
10. **STEP 10: GET /api/auth/me** - Returns authenticated user details from the decoded JWT payload.
