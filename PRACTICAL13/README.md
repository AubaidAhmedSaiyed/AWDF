# Practical 13: AI API Integration into a Web Application

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
1. **STEP 1: Install OpenAI SDK** - Shows installation of the official `openai` Node package.
2. **STEP 2: Secure API Key Configuration** - Demonstrates server-side `.env` storage, keeping API credentials hidden from frontend bundles.
3. **STEP 3: Create backend AI route** - Shows `/api/ai/generate-description` wrapped in `try/catch`.
4. **STEP 4: Invoke AI description generation** - Calls the endpoint with a valid payload.
5. **STEP 5: Test failure path with invalid key** - Deliberately simulates an invalid API key, proving that the app returns a clean fallback description with HTTP 200 without crashing.
6. **STEP 6: Save task with editable suggestion** - Persists the final user-approved task with the generated description to the backend.
