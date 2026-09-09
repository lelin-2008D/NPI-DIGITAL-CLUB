# Supabase Backend

Run `schema.sql` in the Supabase SQL editor before enabling the frontend integration.

After creating the first Supabase Auth user, grant admin access with:

```sql
insert into public.admin_profiles (user_id, role)
values ('AUTH_USER_UUID_HERE', 'admin');
```

Then copy `.env.example` to `.env` and fill:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The browser must never receive the Supabase service-role key.

To seed Supabase from the repository's current `data/default-data.json`, run:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:supabase
```

Use the service-role key only in this local script or trusted deployment tooling. Do not add it to `.env` with the `VITE_` prefix.
