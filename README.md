# Canteen-Carvings
Students waste time waiting in long canteen queues during breaks. Create a website where students view menus, place food orders, and check order status before collecting their food.

## Shared Supabase Setup

Admin passwords, menu data, and uploaded menu images are stored in Supabase. Menu edits are shared with students across browsers and update open pages in real time; they do not rewrite or redeploy `index.html`.

1. Create a Supabase project. Enable email sign-in and student sign-ups, and require email confirmation. Configure a real SMTP sender. Set the email OTP length to six digits and make the email template display `{{ .Token }}`. Phone sign-in and SMS delivery are not used; the mobile number is stored as profile information only.
2. In Supabase Authentication, create three confirmed admin users with these email addresses: `admin1@campuscravings.invalid`, `admin2@campuscravings.invalid`, and `admin3@campuscravings.invalid`. Set each password privately. Keep admin credentials separate from student accounts.
3. Run [`setup.sql`](setup.sql) in the Supabase SQL Editor. Re-run it after schema updates; it creates student profiles and ownership policies, the avatar bucket, order PIN verification, admin-only order access, and Realtime publication. Existing orders are retained, and orders created before PIN support can still be collected without a PIN. The previous student login was browser-only, so those local profiles/passwords cannot be migrated; students must create Supabase-backed accounts.
4. Deploy the register-number login resolver as a Supabase Edge Function:

	```sh
	supabase login
	supabase link --project-ref YOUR_PROJECT_REF
	supabase functions deploy student-login
	```

	The function uses Supabase's server-side `SUPABASE_SERVICE_ROLE_KEY` to resolve student login aliases. Never put that key in website code or expose it to students.
5. In `script.js`, set `SUPABASE_URL` and `SUPABASE_PUBLIC_KEY` to the project's URL and publishable (or legacy anon) key.
6. Deploy the updated page. If the project restricts allowed site URLs, add the deployed website URL in its Auth URL settings.

The page starts with its built-in menu until an admin makes and saves the first edit; that save publishes the complete menu to Supabase. Students sign up with a six-digit email OTP; age is calculated from date of birth. The mobile number is saved to the student profile without SMS verification. Supabase Auth keeps the session between visits using its persistent browser session storage. Students can log in by email or register number and request a password reset by email OTP. Each new order receives a six-digit pickup PIN stored as a hash; the admin must verify it before marking the order collected. Students can rotate and display a new PIN from any signed-in device. Order tracking follows the student account across devices, while the clear PIN is kept only in the ordering browser. Signed-in admins receive order updates through Supabase Realtime. The first admin to accept an order claims it; other admins see who took it and cannot advance its status. Uploaded menu images and optional student avatars use separate storage buckets.

The starter admin passwords are intentionally not included in source control. Accounts whose Supabase user metadata does not contain `password_changed: true` must set a new password on first login. Student passwords are managed only by Supabase Auth.
