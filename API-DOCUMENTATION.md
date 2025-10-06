# 📚 API Documentation - Chandra Dukan
# चंद्रा दुकान - API डॉक्यूमेंटेशन

Complete API reference for Chandra Dukan backend services.

---

## 🌐 Base URL

**Development:** `http://localhost:3000/api`  
**Production:** `https://your-domain.com/api`

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Products API](#products-api)
3. [Categories API](#categories-api)
4. [Orders API](#orders-api)
5. [Customers API](#customers-api)
6. [Analytics API](#analytics-api)
7. [Upload API](#upload-api)
8. [Notifications API](#notifications-api)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "Chandra Shekhar",
    "phone": "9876543210",
    "role": "admin"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "New User",
  "phone": "9876543210",
  "password": "password123",
  "address": "123 Main St"
}
```

### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

---

## 🛍️ Products API

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search by name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - true/false
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```http
GET /api/products?category=Dairy&inStock=true&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Amul Taaza Toned Milk",
      "price": 29,
      "image": "milk-amul.jpg",
      "category": "Dairy & Bread",
      "stock": 50,
      "deliveryTime": "17 MINS",
      "description": "Fresh toned milk",
      "unit": "500ml",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Amul Taaza Toned Milk",
    "price": 29,
    "image": "milk-amul.jpg",
    "category": "Dairy & Bread",
    "stock": 50,
    "deliveryTime": "17 MINS",
    "description": "Fresh toned milk",
    "unit": "500ml"
  }
}
```

### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "price": 99,
  "category": "Snacks",
  "stock": 100,
  "image": "product.jpg",
  "description": "Product description",
  "unit": "1kg",
  "deliveryTime": "17 MINS"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 101,
    "name": "New Product",
    "price": 99,
    "category": "Snacks",
    "stock": 100
  }
}
```

### Update Product
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 89,
  "stock": 150
}
```

### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Update Stock
```http
PATCH /api/products/:id/stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "stock": 200
}
```

---

## 📂 Categories API

### Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dairy & Bread",
      "icon": "🥛",
      "description": "Milk, bread, eggs & more",
      "image": "category-dairy.jpg",
      "productCount": 25
    }
  ]
}
```

### Get Category by ID
```http
GET /api/categories/:id
```

### Create Category
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category",
  "icon": "🧪",
  "description": "Category description",
  "image": "category.jpg"
}
```

### Update Category
```http
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category",
  "description": "New description"
}
```

### Delete Category
```http
DELETE /api/categories/:id
Authorization: Bearer <token>
```

---

## 📦 Orders API

### Get All Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, delivered, cancelled)
- `customerId` - Filter by customer
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "orderId": "ORD-20240101-001",
      "customer": {
        "name": "John Doe",
        "phone": "9876543210",
        "address": "123 Main St, City"
      },
      "items": [
        {
          "productId": 1,
          "name": "Amul Milk",
          "quantity": 2,
          "price": 29,
          "subtotal": 58
        }
      ],
      "subtotal": 58,
      "deliveryCharge": 20,
      "total": 78,
      "paymentMethod": "COD",
      "status": "pending",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Get Order by ID
```http
GET /api/orders/:orderId
```

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St, City",
    "email": "john@example.com"
  },
  "items": [
    {
      "productId": 1,
      "name": "Amul Milk",
      "quantity": 2,
      "price": 29
    }
  ],
  "subtotal": 58,
  "deliveryCharge": 20,
  "total": 78,
  "paymentMethod": "COD",
  "notes": "Please ring the bell"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-20240101-001",
    "status": "pending",
    "estimatedDelivery": "17 MINS",
    "total": 78
  }
}
```

### Update Order Status
```http
PATCH /api/orders/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending` - Order placed
- `confirmed` - Order confirmed
- `preparing` - Being prepared
- `out_for_delivery` - Out for delivery
- `delivered` - Delivered
- `cancelled` - Cancelled

### Cancel Order
```http
POST /api/orders/:orderId/cancel
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

---

## 👥 Customers API

### Get All Customers
```http
GET /api/customers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cust123",
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com",
      "address": "123 Main St",
      "totalOrders": 15,
      "totalSpent": 5000,
      "lastOrder": "2024-01-01T10:00:00Z",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Customer by Phone
```http
GET /api/customers/:phone
Authorization: Bearer <token>
```

### Get Customer Orders
```http
GET /api/customers/:phone/orders
Authorization: Bearer <token>
```

### Update Customer
```http
PUT /api/customers/:phone
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "newemail@example.com",
  "address": "New Address"
}
```

---

## 📊 Analytics API

### Get Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "orders": 45,
      "revenue": 12500,
      "customers": 38
    },
    "week": {
      "orders": 280,
      "revenue": 78000,
      "customers": 195
    },
    "month": {
      "orders": 1200,
      "revenue": 350000,
      "customers": 650
    },
    "topProducts": [
      {
        "id": 1,
        "name": "Amul Milk",
        "sales": 450,
        "revenue": 13050
      }
    ],
    "recentOrders": [
      {
        "orderId": "ORD-20240101-001",
        "customer": "John Doe",
        "total": 78,
        "status": "pending"
      }
    ]
  }
}
```

### Get Sales Data
```http
GET /api/analytics/sales
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` - day, week, month, year
- `startDate` - Start date
- `endDate` - End date

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "totalSales": 78000,
    "totalOrders": 280,
    "averageOrderValue": 278.57,
    "dailyBreakdown": [
      {
        "date": "2024-01-01",
        "sales": 12500,
        "orders": 45
      }
    ]
  }
}
```

### Get Product Analytics
```http
GET /api/analytics/products
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topSelling": [
      {
        "id": 1,
        "name": "Amul Milk",
        "unitsSold": 450,
        "revenue": 13050
      }
    ],
    "lowStock": [
      {
        "id": 5,
        "name": "Product Name",
        "stock": 5
      }
    ],
    "outOfStock": []
  }
}
```

### Get Customer Analytics
```http
GET /api/analytics/customers
Authorization: Bearer <token>
```

---

## 📤 Upload API

### Upload Product Image
```http
POST /api/upload/product
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "image": <file>
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "product-1234567890.jpg",
    "url": "/uploads/products/product-1234567890.jpg",
    "size": 245678
  }
}
```

### Upload Category Image
```http
POST /api/upload/category
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "image": <file>
}
```

### Upload Multiple Images
```http
POST /api/upload/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "images": [<file1>, <file2>, <file3>]
}
```

---

## 🔔 Notifications API

### Send Order Notification
```http
POST /api/notifications/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "ORD-20240101-001",
  "phone": "9876543210",
  "type": "confirmation"
}
```

**Notification Types:**
- `confirmation` - Order confirmed
- `preparing` - Order being prepared
- `out_for_delivery` - Out for delivery
- `delivered` - Order delivered

### Send Custom Notification
```http
POST /api/notifications/custom
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "9876543210",
  "message": "Your custom message here"
}
```

### Send Bulk Notifications
```http
POST /api/notifications/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "customers": ["9876543210", "9876543211"],
  "message": "Special offer today!"
}
```

---

## ❌ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

### Example Error Responses

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "phone": "Phone number must be 10 digits",
      "price": "Price must be a positive number"
    }
  }
}
```

**Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found",
    "details": {
      "productId": 999
    }
  }
}
```

**Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": {
      "hint": "Please provide a valid token"
    }
  }
}
```

---

## ⏱️ Rate Limiting

### Limits
- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **Upload:** 10 requests per hour per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": {
      "retryAfter": 900
    }
  }
}
```

---

## 🔧 Request/Response Headers

### Common Request Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
User-Agent: Chandra-Dukan/1.0
```

### Common Response Headers
```http
Content-Type: application/json
X-Request-ID: req-1234567890
X-Response-Time: 45ms
Cache-Control: no-cache
```

---

## 📝 Pagination

All list endpoints support pagination:

**Request:**
```http
GET /api/products?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 🔍 Filtering & Sorting

### Filtering
```http
GET /api/products?category=Dairy&minPrice=20&maxPrice=100&inStock=true
```

### Sorting
```http
GET /api/products?sortBy=price&order=asc
GET /api/products?sortBy=createdAt&order=desc
```

**Sort Fields:**
- `name` - Product name
- `price` - Price
- `stock` - Stock quantity
- `createdAt` - Creation date
- `updatedAt` - Update date

---

## 🧪 Testing with cURL

### Create Order Example
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "phone": "9876543210",
      "address": "Test Address"
    },
    "items": [
      {
        "productId": 1,
        "name": "Amul Milk",
        "quantity": 2,
        "price": 29
      }
    ],
    "subtotal": 58,
    "deliveryCharge": 20,
    "total": 78,
    "paymentMethod": "COD"
  }'
```

### Get Products with Authentication
```bash
TOKEN="your-jwt-token"

curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 📚 SDKs & Libraries

### JavaScript/Node.js
```javascript
const API_URL = 'http://localhost:3000/api';

// Fetch products
const response = await fetch(`${API_URL}/products`);
const data = await response.json();

// Create order
const order = await fetch(`${API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

### Python
```python
import requests

API_URL = 'http://localhost:3000/api'

# Get products
response = requests.get(f'{API_URL}/products')
products = response.json()

# Create order
order = requests.post(
    f'{API_URL}/orders',
    json=order_data
)
```

---

## 🔗 Webhooks

### Order Status Webhook
Configure webhook URL in admin panel to receive order status updates:

**Webhook Payload:**
```json
{
  "event": "order.status_changed",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "orderId": "ORD-20240101-001",
    "oldStatus": "pending",
    "newStatus": "confirmed",
    "customer": {
      "phone": "9876543210"
    }
  }
}
```

---

## 📞 Support

For API support:
- **Email:** api-support@chandradukan.com
- **Phone:** +91 98765 43210
- **Documentation:** https://docs.chandradukan.com

---

**API Version:** 1.0.0  
**Last Updated:** 2024-01-01

*आपके व्यापार के लिए शक्तिशाली API - Powerful API for your business*
