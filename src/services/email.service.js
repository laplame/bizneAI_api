const nodemailer = require('nodemailer');
const Config = require('../models/config.model');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async initialize(userId) {
    try {
      const config = await Config.findOne({ userId });
      if (!config || !config.email.isConfigured) {
        throw new Error('Email not configured');
      }

      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        }
      });

      return true;
    } catch (error) {
      console.error('Error initializing email service:', error);
      throw error;
    }
  }

  async sendEmail(userId, options) {
    try {
      await this.initialize(userId);
      const config = await Config.findOne({ userId });

      const mailOptions = {
        from: config.email.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendStoreReport(userId, storeData, reportFile) {
    try {
      await this.initialize(userId);
      const config = await Config.findOne({ userId });

      const mailOptions = {
        from: config.email.from,
        to: storeData.contactInfo.email,
        subject: `Store Report - ${storeData.storeName}`,
        html: `
          <h1>Store Report</h1>
          <p>Dear ${storeData.storeName} owner,</p>
          <p>Please find attached your store report.</p>
          <p>Best regards,<br>Your POS System</p>
        `,
        attachments: [{
          filename: 'store_report.pdf',
          content: reportFile
        }]
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending store report:', error);
      throw error;
    }
  }
}

module.exports = new EmailService(); 