# Practical 12: CI/CD Pipeline with GitHub Actions

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
1. **STEP 1: Install testing library** - Checks `jest` and `supertest` packages.
2. **STEP 2: Inspect GitHub Actions workflow file** - Displays `.github/workflows/ci.yml`.
3. **STEP 3: Deliberate failure demo** - Alters test to expect status 500 and runs `npm test` to demonstrate the red failure report.
4. **STEP 4: Fix the test assertion** - Restores the test to expect 200 and confirms the green passing report.
5. **STEP 5: Git deployment commands** - Displays the exact commands to commit and trigger GitHub Actions on `push`.
