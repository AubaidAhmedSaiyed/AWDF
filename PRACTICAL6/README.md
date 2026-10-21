# Practical 6: Full Stack Integration (React + Node + MongoDB)

## 📦 Installation
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

## 🚀 Run Lab Runner
To walk through the steps interactively for taking screenshots:
```bash
npm run lab
```
To run all steps automatically without waiting for keypresses:
```bash
npm run lab -- --auto
```

## 📋 What Each Step Shows
1. **STEP 1: Install and configure CORS on the Express backend** - Shows CORS setup in `server.js` allowing requests from Vite (`http://localhost:5173`).
2. **STEP 2: Start Express Backend & verify CORS and Health status** - Launches backend child process, tests `/api/health`.
3. **STEP 3: Central api.js: Fetch all tasks (GET /tasks)** - Shows `getTasks()` API call and response.
4. **STEP 4: Build task creation form that POSTs to /tasks** - Sends `POST /tasks` with new task payload and shows `201 Created`.
5. **STEP 5: Implement update (PUT /tasks/:id) action** - Updates task completion status via `PUT /tasks/:id`.
6. **STEP 6: Implement delete (DELETE /tasks/:id) action** - Deletes task via `DELETE /tasks/:id`.
7. **STEP 7: Test complete flow & confirm persistence on re-fetch** - Creates a task and re-fetches to prove MongoDB persistence.
