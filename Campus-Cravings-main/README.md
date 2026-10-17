# Canteen-Carvings
Students waste time waiting in long canteen queues during breaks. Create a website where students view menus, place food orders, and check order status before collecting their food.

## Shared Supabase Setup

Admin passwords, menu data, and uploaded menu images are stored in Supabase. Menu edits are shared with students across browsers and update open pages in real time; they do not rewrite or redeploy `index.html`.

1. Create a Supabase project. Enable email/password authentication and disable public sign-ups.
2. In Supabase Authentication, create three confirmed users with these email addresses: `admin1@campuscravings.invalid`, `admin2@campuscravings.invalid`, and `admin3@campuscravings.invalid`. Set each account's initial password privately. These reserved addresses do not receive email, so password recovery must be handled by an authorized project administrator in the Supabase dashboard.
3. Run [`supabase/setup.sql`](supabase/setup.sql) in the Supabase SQL Editor. It creates the shared menu table, public-read/admin-write policies, the menu image bucket, and Realtime publication.
4. In `index.html`, replace `SUPABASE_URL` and `SUPABASE_PUBLIC_KEY` with the project's URL and publishable (or legacy anon) key. Never put a service-role key in the website.
5. Deploy the updated page. If the Supabase project restricts allowed site URLs, add the deployed website URL in its Auth URL settings.

The page starts with its built-in menu until an admin makes and saves the first edit; that save publishes the complete menu to Supabase. After that, Supabase is the shared source of truth. Uploaded images are stored in the `menu-images` bucket, and the bucket's public read access lets students view them without signing in.

The starter passwords are intentionally not included in source control. Accounts whose Supabase user metadata does not contain `password_changed: true` must set a new password on first login. A forgotten password can be reset by an authorized Supabase project administrator.
