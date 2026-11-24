# AquaGuardian

A responsive, local, server-backed rescue-operations workspace. Rescue robot commands are simulations only and do not control hardware.

## Secure local architecture

- Express API, SQLite database, bcrypt password hashes, HTTP-only session cookies, JWT signing, Helmet security headers, and server-side rate limiting.
- SMTP email delivery is optional. Development mode prints verification and reset links in the server console.
- Private configuration and future API keys belong in server environment variables, never in React source or `VITE_` variables.

## Run locally

### One local address (recommended)

```powershell
npm.cmd start
```

This builds the React frontend and starts Express, which serves both the app and `/api` endpoints from the same origin. Open `http://localhost:3001`.

## Install on a phone

AquaGuardian is an installable Progressive Web App (PWA). Publish the app and Express server at the same HTTPS origin so the mobile app can securely reach its API. The service worker caches the app shell and static assets; account sign-in and workspace data still require a connection to the server.

- **Android:** Open the HTTPS address in Chrome, then choose **Install app** or **Add to Home screen** from the browser menu.
- **iPhone/iPad:** Open the HTTPS address in Safari, tap **Share**, then choose **Add to Home Screen**.

The installed app uses the same server-backed accounts and records; it does not create an offline database or an Android APK.

## Build an Android APK (same Wi-Fi PC server)

The APK bundles the app UI and camera preview locally, and sends login and data requests to the PC server over Wi-Fi. Accounts and records remain in the PC's SQLite database. This LAN setup is for development/testing: keep the PC server running and connect the phone to the same trusted Wi-Fi. HTTP traffic is unencrypted, so do not use this setup on public Wi-Fi or for production.

1. Install Android Studio and its Android SDK, then open this project in a terminal.
2. Start the server in a separate terminal with `npm.cmd start`.
3. Find the PC's Wi-Fi IPv4 address with `ipconfig`. Use the address shown under the active Wi-Fi adapter, not `localhost`.
4. Set the API address and create the Android project (replace the example IP with the PC's address):

   ```powershell
   $env:CAPACITOR_SERVER_URL = "http://192.168.1.25:3001"
   npm.cmd run android:init
   ```

5. Build the debug APK:

   ```powershell
   npm.cmd run android:apk
   ```

6. Install `android\app\build\outputs\apk\debug\app-debug.apk` on the phone. Keep the PC server running and both devices on the same Wi-Fi.

If the PC's IP address changes, set the new `CAPACITOR_SERVER_URL` and run `npm.cmd run android:apk` again. The APK depends on the PC server for login and saved data; the bundled UI opens without it, but server-backed features do not. Camera access is requested by Android only when the preview is started. For a public release, use a stable HTTPS API URL instead of LAN HTTP and build a signed release APK.

### Frontend development mode

For Vite hot reload, use two terminals instead:

```powershell
npm.cmd run server
```

```powershell
npm.cmd run dev
```

Open `http://localhost:5173`. In this development-only setup, Vite forwards `/api` requests to Express at `http://localhost:3001`.

For production mode, set server-only environment variables before starting:

```powershell
$env:JWT_SECRET = "replace-with-a-long-random-secret"
$env:NODE_ENV = "production"
$env:APP_ORIGIN = "https://your-domain.example"
$env:SMTP_HOST = "smtp.example.com"
$env:SMTP_PORT = "587"
$env:SMTP_USER = "your-smtp-user"
$env:SMTP_PASS = "server-only-password"
$env:SMTP_FROM = "AquaGuardian <no-reply@your-domain.example>"
npm.cmd start
```

## Production build

```powershell
npm.cmd run build
npm.cmd run preview
```

## Accounts and data

- Sign-up, sign-in, sign-out, password reset, onboarding, profile editing, and account deletion use the Express API and SQLite database.
- Passwords are salted with bcrypt and session cookies are HTTP-only JWT cookies.
- Password reset links expire and are single-use. SMTP settings enable real email delivery; otherwise reset links are printed in the server console.
- Workspace records are associated with the authenticated server account.
- Set a persistent `JWT_SECRET` and secure database backup procedures before production use.
- Keeping private server configuration outside React and `VITE_` variables is required.

## Features

- Responsive desktop and mobile layout
- Operator sign-up and sign-in
- Password reset and account management
- Onboarding and account details
- Robot and SOS records; mission detail timelines, start/completion timings, and confirmed deletion
- SOS response decisions from the Mission Log: create a linked planned mission or record that no robot mission is needed
- Manual/autonomous control-mode UI, demo telemetry, simulated deployment/return, and an illustrative position grid
- Loading and validation states
- Empty states, custom 404, and accessible Terms and Conditions and Privacy Policy pages
- JSON export can be added from the app workspace; browser storage itself is not a database backup

## Safety

This project does not connect to real SOS stations, robot controllers, batteries, temperature/depth sensors, GPS, cameras for underwater imagery, SONAR, acoustic communications, or emergency dispatch systems. Navigation modes, telemetry, controls, and the position grid are demonstrations only; they do not execute onboard autonomy, A* navigation, physical deployment, or belt/valve actuation. A real rescue deployment requires independently engineered hardware, communications, safety interlocks, and validation by qualified professionals. Manual deployment and trained rescue supervision remain required.
