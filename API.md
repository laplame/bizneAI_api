# POS System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except `/auth/register` and `/auth/login` require authentication using a JWT token.

Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Response Format
All API responses follow a standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {} // Optional additional error details
  }
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "string" // Optional, defaults to "cashier"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "token": "string"
    },
    "message": "User registered successfully"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "token": "string"
    },
    "message": "Login successful"
  }
  ```

### Users

#### Get All Users
- **GET** `/users`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "username": "string",
        "email": "string",
        "role": "string"
      }
    ],
    "message": "Users retrieved successfully"
  }
  ```

#### Get User by ID
- **GET** `/users/:id`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    },
    "message": "User retrieved successfully"
  }
  ```

#### Update User
- **PUT** `/users/:id`
- **Headers:** Authorization required
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "role": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string"
    },
    "message": "User updated successfully"
  }
  ```

#### Delete User
- **DELETE** `/users/:id`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": null,
    "message": "User deleted successfully"
  }
  ```

### Products

#### Get All Products
- **GET** `/products`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "stock": "number",
        "category": "string"
      }
    ],
    "message": "Products retrieved successfully"
  }
  ```

#### Get Product by ID
- **GET** `/products/:id`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "category": "string"
    },
    "message": "Product retrieved successfully"
  }
  ```

#### Create Product
- **POST** `/products`
- **Headers:** Authorization required
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "category": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "category": "string"
    },
    "message": "Product created successfully"
  }
  ```

#### Update Product
- **PUT** `/products/:id`
- **Headers:** Authorization required
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "category": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "category": "string"
    },
    "message": "Product updated successfully"
  }
  ```

#### Delete Product
- **DELETE** `/products/:id`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": null,
    "message": "Product deleted successfully"
  }
  ```

#### Update Stock
- **PATCH** `/products/:id/stock`
- **Headers:** Authorization required
- **Body:**
  ```json
  {
    "quantity": "number"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "stock": "number"
    },
    "message": "Stock updated successfully"
  }
  ```

### POS (Point of Sale)

#### Create Sale
- **POST** `/pos/sales`
- **Headers:** Authorization required
- **Body:**
  ```json
  {
    "items": [
      {
        "product": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "paymentMethod": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "saleNumber": "string",
      "items": [
        {
          "product": "string",
          "quantity": "number",
          "price": "number"
        }
      ],
      "total": "number",
      "paymentMethod": "string",
      "status": "string",
      "cashier": "string",
      "createdAt": "string"
    },
    "message": "Sale created successfully"
  }
  ```

#### Get All Sales
- **GET** `/pos/sales`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "saleNumber": "string",
        "items": [
          {
            "product": "string",
            "quantity": "number",
            "price": "number"
          }
        ],
        "total": "number",
        "paymentMethod": "string",
        "status": "string",
        "cashier": "string",
        "createdAt": "string"
      }
    ],
    "message": "Sales retrieved successfully"
  }
  ```

#### Get Sale by ID
- **GET** `/pos/sales/:id`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "saleNumber": "string",
      "items": [
        {
          "product": "string",
          "quantity": "number",
          "price": "number"
        }
      ],
      "total": "number",
      "paymentMethod": "string",
      "status": "string",
      "cashier": "string",
      "createdAt": "string"
    },
    "message": "Sale retrieved successfully"
  }
  ```

#### Cancel Sale
- **POST** `/pos/sales/:id/cancel`
- **Headers:** Authorization required
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "saleNumber": "string",
      "status": "cancelled"
    },
    "message": "Sale cancelled successfully"
  }
  ```

#### Get Sales by Date Range
- **GET** `/pos/sales/date-range`
- **Headers:** Authorization required
- **Query Parameters:**
  - `startDate`: ISO date string
  - `endDate`: ISO date string
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "saleNumber": "string",
        "items": [
          {
            "product": "string",
            "quantity": "number",
            "price": "number"
          }
        ],
        "total": "number",
        "paymentMethod": "string",
        "status": "string",
        "cashier": "string",
        "createdAt": "string"
      }
    ],
    "message": "Sales retrieved successfully"
  }
  ```

## Error Codes

- `INVALID_CREDENTIALS`: Invalid email or password
- `USER_NOT_FOUND`: User not found
- `PRODUCT_NOT_FOUND`: Product not found
- `SALE_NOT_FOUND`: Sale not found
- `INSUFFICIENT_STOCK`: Insufficient stock for product
- `INVALID_SALE_STATUS`: Invalid sale status for operation
- `UNAUTHORIZED`: Unauthorized access
- `VALIDATION_ERROR`: Request validation failed
- `SERVER_ERROR`: Internal server error

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:
- 100 requests per 15 minutes for authenticated users
- 20 requests per 15 minutes for unauthenticated users

## Best Practices

1. Always handle errors appropriately in your client application
2. Store the JWT token securely
3. Implement proper error handling for network issues
4. Use appropriate HTTP methods for each operation
5. Validate input data before sending requests
6. Implement proper error handling for rate limiting
7. Use HTTPS in production
8. Keep your API token secure and never expose it in client-side code 