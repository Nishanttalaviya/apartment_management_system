const nodemailer = require("nodemailer");

class MailerService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER || "rnv1924@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "kpto cskp gmut lgov",
      },
    });
  }

  async sendWelcomeEmail(recipient, name, password) {
    try {
      const mailOptions = {
        from: `"Apartment Management" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject:
          "🎉 Welcome to the Apartment Portal – Your Login Details Inside!",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center;">
              <h2 style="color: #4CAF50;">👋 Welcome, ${name}!</h2>
              <p style="font-size: 16px;">We’re thrilled to have you on board at <strong>Apartment Portal</strong>.</p>
            </div>

            <div style="margin-top: 20px;">
              <p style="font-size: 15px;">Your account has been successfully created. Use the credentials below to log in:</p>
              <ul style="list-style-type: none; padding: 0;">
                <li><strong>📧 Email:</strong> ${recipient}</li>
                <li><strong>🔐 Temporary Password:</strong> ${password}</li>
              </ul>
              <p style="font-size: 14px; color: #888;">(We recommend changing your password after your first login for security.)</p>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <a href="https://your-apartment-portal-url.com/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Now</a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

            <div style="text-align: center; font-size: 13px; color: #777;">
              <p>Need help? Contact our support team anytime.</p>
              <p>— The Apartment Management Team</p>
            </div>
          </div>
        </div>
      `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${recipient}`);
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
  }
}

module.exports = new MailerService();
