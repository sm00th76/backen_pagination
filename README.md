# Product Browser API

A RESTful Product Browser API built with **Node.js**, **Express.js**, and **MongoDB** that provides **cursor-based pagination**, **snapshot consistency**, and **category-based filtering** for efficient browsing of large product catalogs.

---

## Features

* Cursor-based pagination
* Snapshot-based consistent browsing
* Category filtering
* Configurable page size
* Stable sorting using `updatedAt` and `_id`
* Efficient MongoDB queries
* RESTful API design

---

# Base URLs

### Local Development

```text
http://localhost:5000
```

### Production (Render)

```text
https://<your-render-app>.onrender.com
```

---

# API Endpoints

## 1. Health Check

Checks whether the API is running.

### Endpoint

```http
GET /
```

### Example

```bash
curl http://localhost:5000/
```

### Response

```json
{
  "success": true,
  "message": "Product Browser API Running"
}
```

---

## 2. Get Products

Returns the first page of products ordered by newest first.

### Endpoint

```http
GET /api/products
```

### Example

```bash
curl http://localhost:5000/api/products
```

### Response

```json
{
  "success": true,
  "data": [
    ...
  ],
  "pagination": {
    "snapshotTime": "2026-06-26T16:30:00.000Z",
    "nextCursor": {
      "cursorUpdatedAt": "...",
      "cursorId": "..."
    },
    "hasMore": true
  }
}
```

---

## 3. Custom Page Size

Specify the number of products returned.

### Endpoint

```http
GET /api/products?limit=10
```

### Example

```bash
curl "http://localhost:5000/api/products?limit=10"
```

### Expected Behavior

* Returns exactly **10 products**
* Includes `hasMore`
* Includes `nextCursor`

---

## 4. Filter by Category

Retrieve products belonging to a specific category.

### Endpoint

```http
GET /api/products?category=Sports
```

### Example

```bash
curl "http://localhost:5000/api/products?category=Sports"
```

### Expected Behavior

Only products from the **Sports** category are returned.

---

## 5. Category + Page Size

Filter and paginate simultaneously.

### Endpoint

```http
GET /api/products?category=Sports&limit=10
```

### Example

```bash
curl "http://localhost:5000/api/products?category=Sports&limit=10"
```

### Expected Behavior

Returns the first **10 Sports products**.

---

## 6. Cursor Pagination

### Step 1

Fetch the first page.

```http
GET /api/products?category=Sports&limit=10
```

Save the following values from the response:

* `snapshotTime`
* `nextCursor.cursorUpdatedAt`
* `nextCursor.cursorId`

---

### Step 2

Use those values to fetch the next page.

```http
GET /api/products?category=Sports&limit=10&snapshotTime=<snapshotTime>&cursorUpdatedAt=<cursorUpdatedAt>&cursorId=<cursorId>
```

### Expected Behavior

* Returns the next page
* No duplicate products
* Same `snapshotTime`
* New `nextCursor`

---

## 7. Invalid Cursor

### Endpoint

```http
GET /api/products?cursorId=invalid
```

### Expected Response

**HTTP 400**

```json
{
  "success": false,
  "message": "Invalid cursorId"
}
```

---

## 8. Snapshot Consistency Test

This API guarantees a consistent browsing experience.

### Steps

1. Fetch the first page.
2. Save the returned `snapshotTime`.
3. Insert a new product into the database.
4. Fetch the second page using the **same snapshotTime** and cursor values.

### Expected Behavior

The newly inserted product **must not appear**.

Now start a brand-new browsing session:

```http
GET /api/products
```

### Expected Behavior

The newly inserted product appears at the top of the results.

---

## 9. End of Pagination

Continue requesting pages until:

```json
"hasMore": false
```

### Expected Behavior

The final page has been reached.

---

# Query Parameters

| Parameter         | Description                                                  | Required |
| ----------------- | ------------------------------------------------------------ | -------- |
| `limit`           | Maximum number of products to return (recommended ≤100)      | No       |
| `category`        | Filter products by category                                  | No       |
| `snapshotTime`    | Maintains a consistent browsing session                      | No       |
| `cursorUpdatedAt` | `updatedAt` value of the last product from the previous page | No       |
| `cursorId`        | `_id` of the last product from the previous page             | No       |

---

# Example Request

```http
GET /api/products?category=Sports&limit=10&snapshotTime=<snapshotTime>&cursorUpdatedAt=<cursorUpdatedAt>&cursorId=<cursorId>
```

---

# Example Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Football",
      "category": "Sports",
      "price": 1200,
      "updatedAt": "2026-06-26T16:20:00.000Z"
    }
  ],
  "pagination": {
    "snapshotTime": "2026-06-26T16:30:00.000Z",
    "nextCursor": {
      "cursorUpdatedAt": "2026-06-26T16:20:00.000Z",
      "cursorId": "685d1b..."
    },
    "hasMore": true
  }
}
```

---

# Error Responses

### Invalid Cursor

```json
{
  "success": false,
  "message": "Invalid cursorId"
}
```

### Invalid Query Parameters

```json
{
  "success": false,
  "message": "Validation failed"
}
```

---

# Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **REST API**

---

# Testing

You can test the API using:

* Postman
* cURL
* Thunder Client (VS Code)
* Insomnia

---

# Project Structure

```text
.
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── app.js
├── server.js
└── README.md
```

---

# Pagination Flow

```text
First Request
      │
      ▼
Receive Products
      │
      ▼
Save snapshotTime + nextCursor
      │
      ▼
Send next request with cursor
      │
      ▼
Receive next page
      │
      ▼
Repeat until hasMore = false
```

---

## License

This project is licensed under the MIT License.
