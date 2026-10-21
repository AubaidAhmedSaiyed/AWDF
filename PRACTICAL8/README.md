# Practical 8: Performance Optimization and Lazy Loading in React

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
1. **STEP 1: Record baseline metrics before optimization** - Builds the application with eager static imports and logs the single monolithic bundle size.
2. **STEP 2: Inspect Network Tab chunk loading behavior** - Explains DevTools Network chunk loading and throttling.
3. **STEP 3: Convert route imports to lazy imports** - Implements `React.lazy(() => import(...))` for route-level code splitting.
4. **STEP 4: Wrap the Routes block with Suspense and fallback** - Adds `<Suspense fallback={...}>` to display smooth loading feedback during chunk fetch.
5. **STEP 5: Rebuild app and confirm separate chunk files** - Runs `npm run build` and displays the newly split route chunks generated in `dist/assets/`.
6. **STEP 6: Side-by-Side Performance Comparison** - Prints a comparative table showing bundle files before and after lazy loading optimization.
