# TODO: Real-time Multi-Device Stock App Updates

## Approved Plan Steps (User confirmed option 1: Supabase migration + realtime + ngrok)

1. [x] migrations.ts ready (npx tsx migrations.ts after creating tables: categories, products, movements, descriptions + enable Realtime).
2. [ ] Update src/store.ts: Replace localStorage with Supabase CRUD functions + migrateLocalToDb().
3. [ ] Update src/useStock.ts: Mutations use new store funcs + add realtime subscriptions (useEffect channel.on postgres_changes).
4. [x] Added initAuth to src/supabaseClient.ts.
5. [ ] Update src/App.tsx: Add one-time migration trigger + loading state.
6. [ ] Test migrations & realtime sync locally.
7. [ ] Instructions: npm run dev + npx ngrok http 5173 for public URL.
8. [ ] [COMPLETE] Verify cross-device (PC/mobile) real-time updates.

Progress: Starting step 1-2...

