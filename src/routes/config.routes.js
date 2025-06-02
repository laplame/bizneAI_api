const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Configuration
 *   description: Google Drive and Email configuration management
 */

/**
 * @swagger
 * /api/config/google-drive:
 *   post:
 *     summary: Update Google Drive configuration
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - clientSecret
 *               - refreshToken
 *               - folderId
 *             properties:
 *               clientId:
 *                 type: string
 *               clientSecret:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *               folderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google Drive configuration updated successfully
 */
router.post('/google-drive', authMiddleware, configController.updateGoogleDriveConfig);

/**
 * @swagger
 * /api/config/email:
 *   post:
 *     summary: Update email configuration
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service
 *               - auth
 *               - from
 *             properties:
 *               service:
 *                 type: string
 *                 enum: [gmail, outlook, smtp]
 *               host:
 *                 type: string
 *               port:
 *                 type: number
 *               secure:
 *                 type: boolean
 *               auth:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                   pass:
 *                     type: string
 *               from:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email configuration updated successfully
 */
router.post('/email', authMiddleware, configController.updateEmailConfig);

/**
 * @swagger
 * /api/config:
 *   get:
 *     summary: Get current configuration
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 */
router.get('/', authMiddleware, configController.getConfig);

/**
 * @swagger
 * /api/config/test/google-drive:
 *   post:
 *     summary: Test Google Drive connection
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Google Drive connection successful
 */
router.post('/test/google-drive', authMiddleware, configController.testGoogleDrive);

/**
 * @swagger
 * /api/config/test/email:
 *   post:
 *     summary: Test email configuration
 *     tags: [Configuration]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test email sent successfully
 */
router.post('/test/email', authMiddleware, configController.testEmail);

module.exports = router; 