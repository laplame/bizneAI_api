const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const responseMiddleware = require('./middleware/response.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const posRoutes = require('./routes/pos.routes');
const roleRoutes = require('./routes/role.routes');
const ecommerceRoutes = require('./routes/ecommerce.routes');
const configRoutes = require('./routes/config.routes');

dotenv.config();

const app = express();

// Function to check if MongoDB is running
const checkMongoDBConnection = async () => {
  try {
    if (!process.env.MONGODB_ATLAS_URI) {
      throw new Error('MONGODB_ATLAS_URI is not configured in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('\x1b[32m%s\x1b[0m', '✔ Connected to MongoDB Atlas');
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB Atlas connection error:', error.message);
    console.log('\n\x1b[33m%s\x1b[0m', '📋 Please check your MongoDB Atlas configuration:');
    console.log('\x1b[36m%s\x1b[0m', '1. Ensure MONGODB_ATLAS_URI is set in your .env file');
    console.log('\x1b[36m%s\x1b[0m', '2. Verify your Atlas cluster is running');
    console.log('\x1b[36m%s\x1b[0m', '3. Check your IP address is whitelisted in Atlas');
    console.log('\x1b[36m%s\x1b[0m', '4. Verify your username and password are correct');
    return false;
  }
};

// Create a write stream (in append mode) for logging
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

// Morgan custom token for user (if available)
morgan.token('user', (req) => (req.user ? req.user.userId : 'guest'));

// Morgan log format
const logFormat = ':remote-addr [:date[iso]] :method :url :status :res[content-length] - :response-time ms user=:user';

// Use morgan for logging to console and file
app.use(morgan(logFormat));
app.use(morgan(logFormat, { stream: accessLogStream }));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseMiddleware);

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to BizneAI API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      pos: '/api/pos',
      roles: '/api/roles',
      ecommerce: '/api/ecommerce',
      config: '/api/config'
    }
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    body { background: #1a1a1a; color: #ffffff; }
    .swagger-ui { background: #1a1a1a; color: #ffffff; }
    .swagger-ui .info .title { color: #ffffff; }
    .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table { color: #dddddd; }
    .swagger-ui .scheme-container { background: #252525; box-shadow: none; }
    .swagger-ui .opblock-tag { color: #ffffff; background: #333333; }
    .swagger-ui .opblock { background: #252525; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
    .swagger-ui .opblock .opblock-summary-method { font-weight: bold; }
    .swagger-ui .opblock .opblock-summary-description { color: #dddddd; }
    .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #ffffff; }
    .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #ffffff; }
    .swagger-ui .parameter__in { color: #aaaaaa; }
    .swagger-ui .response-col_status { color: #ffffff; }
    .swagger-ui .response-col_description { color: #dddddd; }
    .swagger-ui .btn { background: #4990e2; }
    .swagger-ui .btn:hover { background: #3672b9; }
    .swagger-ui input { background: #333333; color: #ffffff; }
    .swagger-ui textarea { background: #333333; color: #ffffff; }
    .swagger-ui select { background: #333333; color: #ffffff; }
    .swagger-ui .markdown p, .swagger-ui .markdown li, .swagger-ui .markdown code { color: #dddddd; }
    .swagger-ui .model-title { color: #ffffff; }
    .swagger-ui .model { color: #dddddd; }
    .swagger-ui .opblock-tag:hover { background-color: #404040; }
    .swagger-ui .opblock .opblock-section-header { background: #333333; }
  `,
  customSiteTitle: "POS System API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/ecommerce', ecommerceRoutes);
app.use('/api/config', configRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

// Start server only if MongoDB is connected
const startServer = async () => {
  const isConnected = await checkMongoDBConnection();
  if (isConnected) {
    app.listen(PORT, () => {
      console.log('\x1b[36m%s\x1b[0m', '========================================');
      console.log('\x1b[36m%s\x1b[0m', `🚀 Server is running on http://localhost:${PORT}`);
      console.log('\x1b[36m%s\x1b[0m', `📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log('\x1b[36m%s\x1b[0m', '========================================');
    });
  } else {
    process.exit(1); // Exit with error code if MongoDB is not connected
  }
};

startServer(); 