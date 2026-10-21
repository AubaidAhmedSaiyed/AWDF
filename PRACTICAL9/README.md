# Practical 9: In-Memory Caching and Query Optimization

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
1. **STEP 1: Install node-cache** - Shows installation of the in-memory caching module.
2. **STEP 2: Initialize cache instance** - Configures `node-cache` with a 60-second TTL in `config/cache.js` and launches server.
3. **STEP 3: Measure API response times WITHOUT cache** - Sends 3 requests directly querying the database and records each response time.
4. **STEP 4: Measure API response times WITH in-memory cache** - Sends 3 requests fetching directly from memory and records each response time.
5. **STEP 5: Verify cache invalidation on write operation** - Executes `POST /tasks`, demonstrating that `cache.del('all_tasks')` is called to prevent stale data.
6. **STEP 6: Performance Comparison Table with Averages** - Outputs a comparative benchmark table displaying individual timings and average speedup.
