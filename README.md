# BizneAI API

A robust RESTful API for a Point of Sale (POS) system, built with Node.js, Express, and MongoDB (Mongoose). This API supports user authentication (JWT), role-based access control, product and inventory management, sales (POS) operations, and is designed for extensibility and further development.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Database Initialization](#database-initialization)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Extending the API](#extending-the-api)
- [Development Guidelines](#development-guidelines)
- [Security](#security)
- [License](#license)

---

## Features
- **User Authentication** (JWT-based)
- **Role-Based Access Control** (admin, user, etc.)
- **Product Management** (CRUD, inventory, categories)
- **Sales/POS Management** (transactions, stock updates)
- **User Management** (CRUD, activation)
- **Role Management** (CRUD, permissions)
- **Extensible Structure** for future modules
- **Input Validation** and error handling
- **CORS** enabled

---

## Architecture
- **Node.js** with **Express** for REST API
- **MongoDB** with **Mongoose** for ODM
- **JWT** for stateless authentication
- **bcryptjs** for password hashing
- **dotenv** for environment management
- **Modular structure** for scalability

---

## Project Structure
```
├── src/
│   ├── controllers/      # Business logic for each resource
│   ├── middleware/       # Express middlewares (auth, etc.)
│   ├── models/           # Mongoose schemas/models
│   ├── routes/           # Express route definitions
│   ├── scripts/          # Utility scripts (e.g., DB init)
│   └── server.js         # App entry point
├── .env                  # Environment variables
├── package.json          # Project metadata & dependencies
└── README.md             # This file
```

---

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bizneai_api
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the root directory (see below).

---

## Environment Variables
Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bizneai_db
JWT_SECRET=your-super-secret-key
```
- `PORT`: Port for the Express server (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing

---

## Running the Application
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

---

## Database Initialization
To create default roles and an admin user, run:
```bash
node src/scripts/init-db.js
```
- Default admin credentials:
  - Email: `admin@bizneai.com`
  - Password: `admin123`

---

## Authentication & Authorization
- **Login** via `/api/auth/login` to receive a JWT token.
- **Register** via `/api/auth/register` (admin can create users with roles).
- **Protected routes** require the `Authorization: Bearer <token>` header.
- **Role-based access** is enforced in controllers (extendable for more granular permissions).

---

## API Endpoints
### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Users
- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Create product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product
- `PATCH /api/products/:id/stock` — Update product stock

### POS (Sales)
- `POST /api/pos` — Create new sale
- `GET /api/pos` — List all sales
- `GET /api/pos/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` — Sales by date
- `GET /api/pos/:id` — Get sale by ID
- `POST /api/pos/:id/cancel` — Cancel sale

### Roles
- `GET /api/roles` — List all roles
- `GET /api/roles/:id` — Get role by ID
- `POST /api/roles` — Create role
- `PUT /api/roles/:id` — Update role
- `DELETE /api/roles/:id` — Delete role

---

## Error Handling
- Standard HTTP status codes
- Error responses:
  ```json
  {
    "message": "Error message",
    "error": "Detailed error (in development)"
  }
  ```

---

## Extending the API
- **Add new models** in `src/models/`
- **Create controllers** in `src/controllers/`
- **Register routes** in `src/routes/` and in `server.js`
- **Add permissions** in `role.model.js` and enforce in middleware/controllers
- **Write scripts** in `src/scripts/` for data migration, seeding, etc.

---

## Development Guidelines
- Use consistent code style (Prettier/ESLint recommended)
- Write modular, testable code
- Use async/await for all DB operations
- Document new endpoints in this README
- Add unit/integration tests for new features
- Use environment variables for secrets/config
- Keep dependencies up to date

---

## Security
- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- Role-based access control
- Input validation (add more as needed)
- CORS enabled
- Never commit secrets to version control

---

## License
MIT 