# Practical 11: Containerization with Docker and Docker Compose

## 📦 Installation & Prerequisites
- Docker Desktop / Docker Engine installed
- Node.js 18+

## 🚀 Run Lab Runner
To walk through the steps interactively and take screenshots:
```bash
npm run lab
```
To run all steps automatically:
```bash
npm run lab -- --auto
```

## 🐳 Manual Docker Run
```bash
docker compose up --build
```
Access points:
- React Frontend: `http://localhost:5173`
- Express Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

## 📋 What Each Step Shows
1. **STEP 1: Verify Docker & Compose** - Runs `docker --version` and `docker compose version`.
2. **STEP 2: Backend Dockerfile** - Displays backend container setup.
3. **STEP 3: Frontend Dockerfile** - Displays multi-stage build frontend container setup.
4. **STEP 4: Inspect docker-compose.yml** - Displays service orchestration and bridge network.
5. **STEP 5: Run the entire stack** - Demonstrates `docker compose up --build`.
6. **STEP 6: Confirm running containers** - Executes `docker ps` to verify active containers.
