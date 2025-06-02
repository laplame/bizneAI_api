const Config = require('../models/config.model');

exports.updateGoogleDriveConfig = async (req, res) => {
  try {
    const { clientId, clientSecret, refreshToken, folderId } = req.body;

    let config = await Config.findOne({ userId: req.user.userId });
    if (!config) {
      config = new Config({ userId: req.user.userId });
    }

    config.googleDrive = {
      clientId,
      clientSecret,
      refreshToken,
      folderId,
      isConfigured: true
    };

    await config.save();
    res.json(config, 'Google Drive configuration updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating Google Drive configuration', error: error.message });
  }
};

exports.updateEmailConfig = async (req, res) => {
  try {
    const { service, host, port, secure, auth, from } = req.body;

    let config = await Config.findOne({ userId: req.user.userId });
    if (!config) {
      config = new Config({ userId: req.user.userId });
    }

    config.email = {
      service,
      host,
      port,
      secure,
      auth,
      from,
      isConfigured: true
    };

    await config.save();
    res.json(config, 'Email configuration updated successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error updating email configuration', error: error.message });
  }
};

exports.getConfig = async (req, res) => {
  try {
    const config = await Config.findOne({ userId: req.user.userId });
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    // Remove sensitive information
    const safeConfig = {
      ...config.toObject(),
      googleDrive: {
        ...config.googleDrive,
        clientSecret: undefined,
        refreshToken: undefined
      },
      email: {
        ...config.email,
        auth: {
          ...config.email.auth,
          pass: undefined
        }
      }
    };

    res.json(safeConfig, 'Configuration retrieved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error fetching configuration', error: error.message });
  }
};

exports.testGoogleDrive = async (req, res) => {
  try {
    const googleDriveService = require('../services/googleDrive.service');
    await googleDriveService.initialize(req.user.userId);
    res.json({ message: 'Google Drive connection successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error testing Google Drive connection', error: error.message });
  }
};

exports.testEmail = async (req, res) => {
  try {
    const emailService = require('../services/email.service');
    const config = await Config.findOne({ userId: req.user.userId });

    await emailService.sendEmail(req.user.userId, {
      to: config.email.auth.user,
      subject: 'Test Email',
      text: 'This is a test email from your POS system.',
      html: '<p>This is a test email from your POS system.</p>'
    });

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error testing email configuration', error: error.message });
  }
}; 