const express = require('express');
const router = express.Router();
const ecommerceController = require('../controllers/ecommerce.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: E-commerce
 *   description: E-commerce store management
 */

/**
 * @swagger
 * /api/ecommerce:
 *   post:
 *     summary: Create a new e-commerce store
 *     tags: [E-commerce]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *               - contactInfo
 *             properties:
 *               storeName:
 *                 type: string
 *               storeDescription:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: object
 *     responses:
 *       201:
 *         description: Store created successfully
 */
router.post('/', authMiddleware, ecommerceController.createStore);

/**
 * @swagger
 * /api/ecommerce:
 *   get:
 *     summary: Get all stores with pagination
 *     tags: [E-commerce]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get('/', ecommerceController.getAllStores);

/**
 * @swagger
 * /api/ecommerce/search:
 *   get:
 *     summary: Search stores
 *     tags: [E-commerce]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', ecommerceController.searchStores);

/**
 * @swagger
 * /api/ecommerce/my-store:
 *   get:
 *     summary: Get current user's store
 *     tags: [E-commerce]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store details
 */
router.get('/my-store', authMiddleware, ecommerceController.getStoreByUserId);

/**
 * @swagger
 * /api/ecommerce/{id}:
 *   get:
 *     summary: Get store by ID
 *     tags: [E-commerce]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details
 */
router.get('/:id', ecommerceController.getStoreById);

/**
 * @swagger
 * /api/ecommerce/{id}:
 *   put:
 *     summary: Update store
 *     tags: [E-commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Store updated successfully
 */
router.put('/:id', authMiddleware, ecommerceController.updateStore);

/**
 * @swagger
 * /api/ecommerce/{id}:
 *   delete:
 *     summary: Delete store
 *     tags: [E-commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store deleted successfully
 */
router.delete('/:id', authMiddleware, ecommerceController.deleteStore);

module.exports = router; 