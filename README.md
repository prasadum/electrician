# NSTI Calicut – Electrician modules
Home page (`index.html`), modules, and admin page (`admin.html`). Host with GitHub Pages (Settings → Pages → main / root).
## Progress tracking (free, Google Sheet)
1. Create a Google Sheet. Extensions → Apps Script. Paste `Code.gs`.
2. Project Settings → Script properties → add `ADMIN_KEY` = a secret only you know.
3. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**. Copy the `/exec` URL into `config.js` (`SCRIPT_URL`). Commit.
4. Open `admin.html`, enter the same key to see all trainees. The Sheet tab "Progress" has the same data for filtering and charts.
Trainees sign in with an email and a 6-digit code sent by your script (free Gmail limit about 100 mails/day). Optional batch. Progress saves on the phone, syncs when online, and the same email restores it on another phone. Authorise Gmail sending when you first deploy.
## Add a module
Copy the new `.html` into the repo and add one line to `MODULES` in `config.js`.
