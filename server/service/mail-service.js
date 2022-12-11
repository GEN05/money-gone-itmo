const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Account activation",
      text: "",
      html: `
                    <div>
                        <h1>To activate your account, follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }

  async sendResetMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Password recovery",
      text: "",
      html: `
                    <div>
                        <h1>To reset your password, follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
    });
  }

  async sendSuccessMail(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Password recovery",
      text: "",
      html: `
                    <div>
                        <h1>Password Changed Successfully</h1>
                    </div>
                `,
    });
  }
}

module.exports = new MailService();
