# Practical 5: MongoDB Integration and Schema Design with Mongoose

**Course Outcomes / Program Outcomes:** CO2, CO3 / PO3, PO5  
**Objective:** Connect a MongoDB database to an Express server, enforce data validation through Mongoose schema, replace in-memory storage with persistent document storage, and return structured JSON validation errors.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client (Postman / Browser UI / cURL)"]
    Express["Express Server (server.js)"]
    Router["Router (routes/taskRoutes.js)"]
    Controller["Controller (controllers/taskController.js)"]
    Mongoose["Mongoose ODM (models/Task.js)"]
    Hook["Pre-save Hook (Trim title)"]
    Validation["Schema Validator (required, enum, defaults)"]
    MongoDB[("MongoDB Database (tasks collection)")]
    ErrorHandler["Global Error Handler (middleware/errorHandler.js)"]

    Client -->|HTTP Requests| Express
    Express --> Router
    Router --> Controller
    Controller --> Mongoose
    Mongoose --> Hook
    Hook --> Validation
    Validation -->|Validation Passed| MongoDB
    Validation -->|Validation Failed| ErrorHandler
    ErrorHandler -->|Structured JSON Error (400/404)| Client
    MongoDB -->|Document Data| Controller
    Controller -->|JSON Response (200/201)| Client
```

---

## 📂 Project Structure

```text
PRACTICAL5/
├── .env                         # Environment variables (PORT, MONGO_URI)
├── .env.example                 # Example environment template
├── .gitignore                   # Git ignore patterns
├── package.json                 # Project dependencies & scripts
├── server.js                    # Express app entry point
├── config/
│   └── db.js                    # Mongoose MongoDB connection module
├── models/
│   └── Task.js                  # Mongoose Task Schema, enum validation & pre-save hook
├── controllers/
│   └── taskController.js        # CRUD controllers using Mongoose model methods
├── routes/
│   └── taskRoutes.js            # RESTful route definitions
├── middleware/
│   └── errorHandler.js          # Centralized error handler returning structured JSON
├── public/                      # Interactive Web Validation & Test Dashboard
│   ├── index.html
│   ├── style.css
│   └── app.js
├── postman_collection.json      # Postman / Thunder Client collection export
├── test_api.js                  # Automated end-to-end API test script
└── README.md                    # Lab documentation and analysis questions
```

---

## 🚀 Setup and Execution Instructions

### 1. Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection URI)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Verify `.env` has the MongoDB connection string:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
```

### 4. Start the Server
- Development mode (with live auto-reload):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

### 5. Access the Web Dashboard
Open your browser and navigate to:
```
http://localhost:5000
```
The dashboard provides an interactive **Schema Validation Lab** to test required fields, enums, pre-save trimming, and error status codes directly in the browser!

### 6. Run the Automated Test Suite
In a new terminal window, execute:
```bash
npm test
```

---

## 📋 Mongoose Task Schema Definition

Defined in `models/Task.js`:

```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority. Allowed values: low, medium, high'
      },
      default: 'medium',
      lowercase: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// Pre-save hook: automatically trims whitespace from title
taskSchema.pre('save', function (next) {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') {
    next();
  }
});

module.exports = mongoose.model('Task', taskSchema);
```

---

## ⚡ REST API Endpoints Specification

| Method | Endpoint | Description | Request Body Example | Success Status |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health status | None | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks (supports `?completed=`, `?priority=`, `?search=`) | None | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by ID | None | `200 OK` (or `404 Not Found`) |
| `POST` | `/tasks` | Create a new task | `{ "title": "...", "description": "...", "priority": "high" }` | `201 Created` |
| `PUT` | `/tasks/:id` | Update existing task | `{ "completed": true, "priority": "low" }` | `200 OK` |
| `DELETE`| `/tasks/:id` | Delete task by ID | None | `200 OK` |

---

## 🛡️ Structured Validation Error Handling

Instead of leaking raw internal Mongoose error objects or crashing the server, `middleware/errorHandler.js` intercepts Mongoose errors and returns structured JSON:

### Example: Missing Title Error (HTTP 400)
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Task title is required",
  "fields": {
    "title": "Task title is required"
  }
}
```

### Example: Invalid Priority Enum Error (HTTP 400)
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "critical is not a valid priority. Allowed values: low, medium, high",
  "fields": {
    "priority": "critical is not a valid priority. Allowed values: low, medium, high"
  }
}
```

### Example: Resource Not Found (HTTP 404)
```json
{
  "success": false,
  "error": "NotFoundError",
  "message": "Task not found with ID: 507f1f77bcf86cd799439011"
}
```

### Example: Malformed ObjectId CastError (HTTP 400)
```json
{
  "success": false,
  "error": "InvalidIdError",
  "message": "Invalid ObjectId format for parameter 'id': 'invalid-id-xyz'"
}
```

---

## 🧠 Key Questions & In-Depth Analysis

### 1. What is the purpose of a schema in a NoSQL database like MongoDB, given that MongoDB itself is schema-less?
- **MongoDB's Nature**: MongoDB stores documents as flexible BSON documents inside collections without requiring predefined table columns or schemas at the database engine level.
- **Application Needs**: In real-world enterprise applications, having completely unrestricted documents quickly leads to data corruption, missing critical fields, mismatched data types (e.g. integer vs string numbers), and unexpected runtime crashes.
- **Role of Mongoose Schema**: Mongoose acts as an **Object Data Modeling (ODM)** layer at the Node.js application boundary. It provides:
  1. **Strict Type Casting**: Automatically coerces incoming payloads into expected types.
  2. **Business Constraints**: Enforces required fields, length limits, regex patterns, and enum sets.
  3. **Default Values**: Fills in default timestamps or states without requiring manual frontend logic.
  4. **Middleware & Hooks**: Executes pre/post hooks for data normalization (e.g., trimming, hashing passwords).
  5. **Predictability**: Ensures developers and services interact with a standardized data model.

### 2. Why is it important to define required fields and default values at the schema level rather than relying on frontend validation alone?
- **Bypassable Client**: Frontend forms can easily be bypassed or forged using Postman, Thunder Client, cURL, automated scripts, or direct HTTP API requests.
- **Single Source of Truth**: Schema-level validation guarantees that regardless of how a request enters the backend (web app, mobile app, 3rd party webhook, CLI tool), data integrity rules are unconditionally enforced.
- **Data Consistency**: Schema defaults (such as `completed: false` and `createdAt: Date.now`) eliminate human error and ensure every document in the database has uniform attributes.
- **Defense-in-Depth**: Best practice is *defense-in-depth*: frontend validation provides instantaneous user feedback, while backend schema validation provides authoritative security and integrity.

### 3. What happens internally when a document fails Mongoose validation — where is the request stopped?
- **Validation Pipeline Order**:
  1. Express receives the request and parses the body into `req.body`.
  2. The controller invokes `Task.create(req.body)` or `new Task(req.body).save()`.
  3. Mongoose triggers its internal validation phase **before sending any command over the TCP socket to MongoDB**.
  4. Mongoose iterates through every schema field, executes type casting, runs custom validators, and checks constraints (`required`, `enum`, `min`, `max`).
  5. **Where it stops**: If any validator fails, Mongoose halts execution immediately **within Node.js memory**. It constructs a `mongoose.Error.ValidationError` containing details for all failed fields.
  6. **Zero Database Traffic**: Crucially, **no network query or BSON write operation is transmitted to the MongoDB server**.
  7. The error is thrown as a rejected Promise, captured by the `catch (err)` block in the controller, and forwarded via `next(err)` to the global error middleware to return HTTP 400.

---

## 📮 Postman / Thunder Client Testing Guide

Import [`postman_collection.json`](postman_collection.json) directly into Postman or Thunder Client to run the following test cases:

1. **Health Check**: `GET http://localhost:5000/api/health`
2. **Create Task (Valid)**: `POST http://localhost:5000/tasks`
3. **Pre-save Trim Hook**: `POST http://localhost:5000/tasks` with title `"   Spaced Title   "`
4. **Validation Test (Missing Title)**: `POST http://localhost:5000/tasks` with `{ "description": "no title" }` (Expect `400 Bad Request`)
5. **Validation Test (Invalid Priority)**: `POST http://localhost:5000/tasks` with `{ "title": "t1", "priority": "urgent" }` (Expect `400 Bad Request`)
6. **Get All Tasks**: `GET http://localhost:5000/tasks`
7. **Get Single Task**: `GET http://localhost:5000/tasks/:id`
8. **Get 404 Task**: `GET http://localhost:5000/tasks/507f1f77bcf86cd799439011` (Expect `404 Not Found`)
9. **Get Malformed ID**: `GET http://localhost:5000/tasks/abc-invalid-id` (Expect `400 Bad Request`)
10. **Update Task**: `PUT http://localhost:5000/tasks/:id`
11. **Delete Task**: `DELETE http://localhost:5000/tasks/:id`
