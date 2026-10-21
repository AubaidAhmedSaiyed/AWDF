# Practical 10: Asynchronous Processing with Event-Driven Architecture

## 📦 Installation
```bash
npm install
```

## 🚀 Run Lab Runner
To walk through the steps interactively and take screenshots:
```bash
npm run lab
```
To run all steps automatically:
```bash
npm run lab -- --auto
```

## 📋 What Each Step Shows
1. **STEP 1: Create dedicated events module** - Shows `EventEmitter` singleton setup in `events.js`.
2. **STEP 2: Register listener for task-created event** - Shows `listeners.js` listening for `task-created` with an artificial delay.
3. **STEP 3: Trigger POST /tasks and demonstrate non-blocking immediate response** - Sends `POST /tasks` and confirms that the API returns `201 Created` without waiting for listener completion.
4. **STEP 4: Observe background execution and timestamp ordering** - Displays the exact ISO timestamps showing the API response timestamp occurs before the background notification completion timestamp.
