const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendContactEmail({ name, email, number, subject, message }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

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

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Error in sendContactEmail:", error);
    return { success: false, error };
  }
}

module.exports = { sendContactEmail };

