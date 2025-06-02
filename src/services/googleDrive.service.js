const { google } = require('googleapis');
const Config = require('../models/config.model');

class GoogleDriveService {
  constructor() {
    this.oauth2Client = null;
  }

  async initialize(userId) {
    try {
      const config = await Config.findOne({ userId });
      if (!config || !config.googleDrive.isConfigured) {
        throw new Error('Google Drive not configured');
      }

      this.oauth2Client = new google.auth.OAuth2(
        config.googleDrive.clientId,
        config.googleDrive.clientSecret
      );

      this.oauth2Client.setCredentials({
        refresh_token: config.googleDrive.refreshToken
      });

      return true;
    } catch (error) {
      console.error('Error initializing Google Drive:', error);
      throw error;
    }
  }

  async uploadFile(userId, fileName, fileContent, mimeType) {
    try {
      await this.initialize(userId);
      const config = await Config.findOne({ userId });

      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      const fileMetadata = {
        name: fileName,
        parents: [config.googleDrive.folderId]
      };

      const media = {
        mimeType: mimeType,
        body: fileContent
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw error;
    }
  }

  async getFileUrl(userId, fileId) {
    try {
      await this.initialize(userId);
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      const response = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink'
      });

      return response.data.webViewLink;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  async deleteFile(userId, fileId) {
    try {
      await this.initialize(userId);
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      await drive.files.delete({
        fileId: fileId
      });

      return true;
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw error;
    }
  }
}

module.exports = new GoogleDriveService(); 