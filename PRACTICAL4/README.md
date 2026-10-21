# Practical 4: Building a RESTful API with Node.js and Express

**Course:** Advanced Web Development Frameworks (ITUE301) | Semester: 5th  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Faculty of Technology and Engineering (CSPIT / DEPSTAR)**  
**CO/PO Mapping:** CO2 / PO3, PO5  

---

## 🎯 Objective
To design and implement a RESTful backend server with complete CRUD endpoints using Express, architect a layered middleware pipeline (request logging, media type validation, route validation), and implement a centralized global error handling middleware.

---

## 🏛️ Middleware Pipeline Architecture

```mermaid
graph TD
    Client["Client (Browser / Postman / cURL)"]
    Logger["Request Logging Middleware (app.use)"]
    JsonParser["express.json() Body Parser"]
    ContentType["Content-Type Validator Middleware (POST/PUT)"]
    IdValidator["Route Param ID Validator (:id)"]
    Controller["Task Controller (In-Memory Array Storage)"]
    NotFound["404 Route Not Found Middleware"]
    ErrorHandler["Global Centralized Error Handler (err, req, res, next)"]

    Client -->|HTTP Request| Logger
    Logger --> JsonParser
    JsonParser --> ContentType
    ContentType -->|Invalid Content-Type| ErrorHandler
    ContentType -->|Valid| IdValidator
    IdValidator -->|Invalid ID| ErrorHandler
    IdValidator -->|Valid ID| Controller
    Controller -->|Success Response (200 / 201)| Client
    Controller -->|Exceptions via next(err)| ErrorHandler
    JsonParser -->|Unmatched Route| NotFound
    NotFound --> Client
    ErrorHandler -->|Structured JSON Error (400/404/415/500)| Client
```

---

## 📂 Project Structure

```text
PRACTICAL4/
├── package.json                    # Project metadata & npm scripts
├── server.js                       # Express app entry & pipeline setup
├── test_api.js                     # Automated API testing script
├── .gitignore                      # Node modules exclusion
├── README.md                       # Complete documentation & viva answers
├── middleware/
│   ├── logger.js                   # Logs method, URL, and ISO timestamp
│   ├── contentTypeValidator.js     # Supplementary: Rejects non-JSON payloads
│   ├── validateTaskId.js           # Supplementary: Validates numeric ID params
│   └── errorHandler.js             # Centralized global error handling middleware
├── controllers/
│   └── taskController.js           # CRUD operations (GET, POST, PUT, DELETE)
└── routes/
    └── taskRoutes.js               # Route mapping with bound middlewares
```

---

## 🚀 Getting Started

### 1. Installation
Navigate to `PRACTICAL4` and install dependencies:
```bash
cd PRACTICAL4
npm install
```

### 2. Start the Server
```bash
npm start
```
Server starts on `http://localhost:5000`.

### 3. Automated API Test Suite
In a second terminal window (or once server is running):
```bash
npm test
```
This runs `test_api.js` which verifies all 10 scenarios (GET all, POST create, GET single, PUT update, DELETE, 400 ID validation, 415 content type rejection, 404 handler, and 500 error propagation).

---

## 📡 REST API Specification

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & API status | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks (optional `?completed=true/false`) | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve a single task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task (JSON payload required) | `201 Created`, `400 Bad Request`, `415 Unsupported Media` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete a task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## 📋 Viva & Conceptual Questions with Answers

### Q1. Why must the error handling middleware be defined last in the middleware chain?
> **Answer:** 
> Express processes middleware sequentially in the order they are registered via `app.use()`. Standard route handlers and middleware accept three parameters `(req, res, next)`. An error-handling middleware is specially identified by accepting **four parameters**: `(err, req, res, next)`. When an error is forwarded from any upstream middleware or route handler via `next(err)`, Express bypasses all remaining standard middleware and jumps directly to the next four-argument error handler. If the error handler were registered before routes, upstream routes could never forward errors to it.

### Q2. What is the difference between `app.use()` and a route-specific middleware?
> **Answer:** 
> - `app.use(middleware)` registers an **application-level** middleware that executes on **every incoming HTTP request** across all paths and methods (e.g. logging, body parsing, CORS).
> - Route-specific middleware (e.g., `router.get('/:id', validateTaskId, controller)`) is only invoked when a request matches that exact HTTP verb and route pattern. It prevents executing irrelevant validation logic on unassociated endpoints.

### Q3. Why is it considered bad practice to send raw error stack traces to the client?
> **Answer:**
> Sending raw stack traces exposes sensitive internal architecture details to attackers, including:
> 1. Absolute server filesystem paths (`/d/AWDF/...`).
> 2. Specific library versions with known CVE vulnerabilities.
> 3. Database connection parameters or query structures.
> 
> Production error handlers must always sanitize errors, logging the stack trace securely on the server while returning a clean, uniform JSON error object to the client.

---

## 🛠️ Troubleshooting Guide

| Symptom | Likely Cause | Solution |
| :--- | :--- | :--- |
| Request hangs indefinitely | Middleware did not call `next()` or send response | Ensure every middleware branch either invokes `next()` or finishes with `res.json()` / `res.send()` |
| `req.body` is `undefined` | Missing `express.json()` middleware | Add `app.use(express.json())` before declaring route handlers |
| Error handler never triggers | Handler declared before routes or error not forwarded | Move error handler to the very end of `server.js` and call `next(err)` inside `catch` blocks |
| `Cannot GET /tasks` | Route path typo or server not restarted | Check path spelling in `taskRoutes.js` and restart Node server |
