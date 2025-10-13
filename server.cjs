// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const cors = require("cors");

const app = express(); // ✅ Declare app before using it

// CORS setup to allow requests from GitHub Pages, Render frontend, and localhost
app.use(cors({
  origin: [
    "https://kunj2411.github.io",
    "https://testcloud-1-xoxh.onrender.com",
    "http://localhost:3000",
    "http://localhost:8080"
  ],
  credentials: true
}));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (like index.html, CSS, JS)
app.use(express.static(__dirname));

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle contact form submission and send email
app.post("/send", async (req, res) => {
  const { name, email, number, subject, message } = req.body;

  // Validate input
  if (!name || !email || !number || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "All contact fields are required (Name, Email, Phone Number, Subject, Message)."
    });
  }

  try {
    // Get OAuth2 access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Uncore Digital Contact Form" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `[New Inquiry] ${subject} from ${name}`,
      text: `
      *** NEW CONTACT FORM SUBMISSION ***

      Name: ${name}
      Email: ${email}
      Phone Number: ${number}
      Subject: ${subject}

      --- Message ---
      ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      error: "Error sending message. Check server logs for details (e.g., expired token)."
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
