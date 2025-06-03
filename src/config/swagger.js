const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POS System API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Point of Sale System',
      contact: {
        name: 'API Support',
        email: 'support@bizneai.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            cost: { type: 'number' },
            description: { type: 'string' },
            category: { type: 'string' },
            photoFilename: { type: 'string' },
            photoUrl: { type: 'string' },
            isWeightBased: { type: 'boolean' },
            metadata: {
              type: 'object',
              properties: {
                createdAt: { type: 'string', format: 'date-time' },
                platform: { type: 'string', enum: ['ios', 'android', 'web'] },
                hasLocalPhoto: { type: 'boolean' },
                hasCloudinaryUrl: { type: 'boolean' },
                isWeightBased: { type: 'boolean' }
              }
            },
            stock: { type: 'number' },
            isActive: { type: 'boolean' }
          }
        },
        Sale: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            saleNumber: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' }
                }
              }
            },
            total: { type: 'number' },
            paymentMethod: { type: 'string' },
            status: { type: 'string' },
            cashier: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            permissions: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

module.exports = swaggerJsdoc(options); 