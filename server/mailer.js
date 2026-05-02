import nodemailer from "nodemailer";

// Transporter create பண்ணு
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mkshopzone2@gmail.com",
    pass: "iclb iwbk xnqu jdsc"   // ✅ App Password
  }
});

// Connection verify பண்ணு
export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Server ready!");
  } catch (err) {
    console.error("❌ Verification failed:", err);
  }
};

// Email அனுப்பு
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"MK Shopzone" <mkshopzone2@gmail.com>',
      to,
      subject,
      text: "Plain text version",
      html
    });

    console.log("✅ Message sent:", info.messageId);
    console.log("👀 Preview URL:", nodemailer.getTestMessageUrl(info));

    if (info.rejected.length > 0) {
      console.warn("⚠️ Rejected:", info.rejected);
    }

    return { success: true, messageId: info.messageId };

  } catch (err) {
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        console.error("🔴 Network error:", err.message);
        break;
      case "EAUTH":
        console.error("🔴 Auth failed:", err.message);
        break;
      default:
        console.error("🔴 Send failed:", err.message);
    }
    return { success: false, error: err.message };
  }
};

export default { sendEmail, verifyConnection };
