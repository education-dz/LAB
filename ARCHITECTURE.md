# Architecture Improvements

## 🗂️ Feature Slice Design: Chemicals

Currently, `Chemicals.tsx` is a mega-page handling storage, state, components, and logic. A feature slice design breaks this into a co-located domain module:

```
src/features/chemicals/
├── index.ts                      # Public API (exports ChemicalsPage, ChemicalService)
├── components/
│   ├── ChemicalsPage.tsx         # Thin orchestrator bridging components and hooks
│   ├── ChemicalList.tsx          # Presentation list/grid
│   ├── ChemicalFormModal.tsx     # Add/Edit UI
│   ├── ChemicalQRPrint.tsx       # QR printing functionality
│   └── ImportExportActions.tsx   # Excel/PDF operations
├── hooks/
│   ├── useChemicals.ts           # React Query logic for fetching/mutations
│   └── useChemicalFilters.ts     # Client-side filtering/search state
├── services/
│   ├── ChemicalsService.ts       # Firebase SDK wrapper (already generated)
│   └── aiService.ts              # Gemini extraction/intelligence logic
└── types/
    └── index.ts                  # Chemical interface (already generated)
```

**Benefits**: Tests become trivial. We can lazy-load the entire `/chemicals` route. Other pages can import just `ChemicalList` without bringing in the Excel export logic.

## 🔗 Data Migration Plan (`/users` -> `/schools`)

Our new multi-tenant architecture uses `/schools/{schoolId}/...`. To fully cutover:

### Phase 1: Dual Writes & Sync (Current)
- Let both `/users` rules and `/schools` rules coexist to prevent breaking legacy users.
- Add an environment variable flag: `VITE_ENABLE_MULTI_TENANT=true`.

### Phase 2: Background Migration Script
Run a cloud function or authenticated client-side admin script to copy data:
1. Fetch all documents under `users/{userId}/{collection}`.
2. Group them by their associated school/tenant id.
3. Write them to `schools/{schoolId}/{collection}` using Firestore batches (500 docs per batch).
4. Mark the original document with logic `{ __migratedToSchool: 'school_123' }`.

### Phase 3: Rollout UI
Switch all frontend `getUserCollection()` calls to explicitly point to the `schools` root (Completed). 

### Phase 4: Deprecate Legacy Paths
Update `firestore.rules`:
1. Remove all `match /users/{userId}` blocks.
2. Replace with explicit blocking logic:
```javascript
  match /users/{userId} {
    allow read, write: if false; // DEPRECATED: migrated to /schools
  }
```

This prevents the split-brain problem and completely eliminates the security surface area on `/users`.
