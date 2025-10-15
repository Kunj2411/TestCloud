require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sendContactEmail } = await import('./mailer.js'); // 👈 import mailer.js

const app = express();

app.use(cors({
  origin: [
    "https://kunj2411.github.io",
    "https://testcloud-mfnc.onrender.com/",
    "https://testcloud-1-xoxh.onrender.com",
    "http://localhost:3000",
    "http://localhost:8080"
  ],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/send", async (req, res) => {
  const { name, email, number, subject, message } = req.body;

  if (!name || !email || !number || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required."
    });
  }

  const result = await sendContactEmail({ name, email, number, subject, message });

  if (result.success) {
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } else {
    console.error("❌ Mail error:", result.error);
    res.status(500).json({
      success: false,
      error: "Error sending message. Check server logs."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
