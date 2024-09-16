This is a Frontend for [Gehe.fyi](https://gehe.fyi/) project which is a url shortener bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

Backend Server API Documentation
Welcome to the API documentation for the backend server. This guide is intended for frontend developers to understand and integrate with the backend APIs effectively.

Table of Contents
Base URL
Authentication
API Endpoints
User Authentication
Login
Register
User Profile
Get User Profile
Update User Profile
Items Management
Get Items
Create Item
Update Item
Delete Item
Error Handling
Examples
Contact
Base URL
All API requests are made to the following base URL:

arduino
Copy code
<https://api.yourapp.com/v1>
Authentication
All endpoints (except for login and registration) require authentication via a JSON Web Token (JWT). Include the token in the Authorization header:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
API Endpoints
User Authentication
Login
Endpoint: POST /auth/login

Description: Authenticate a user and receive a JWT.

Request Body:

json
Copy code
{
  "email": "<user@example.com>",
  "password": "your_password"
}
Response:

json
Copy code
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "<user@example.com>"
  }
}
Register
Endpoint: POST /auth/register

Description: Create a new user account.

Request Body:

json
Copy code
{
  "name": "John Doe",
  "email": "<user@example.com>",
  "password": "your_password"
}
Response:

json
Copy code
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "<user@example.com>"
  }
}
User Profile
Get User Profile
Endpoint: GET /users/me

Description: Retrieve the authenticated user's profile.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Response:

json
Copy code
{
  "id": "user_id",
  "name": "John Doe",
  "email": "<user@example.com>",
  "createdAt": "2023-01-01T00:00:00Z"
}
Update User Profile
Endpoint: PUT /users/me

Description: Update the authenticated user's profile information.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Request Body:

json
Copy code
{
  "name": "Jane Doe",
  "password": "new_password" // Optional
}
Response:

json
Copy code
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "Jane Doe",
    "email": "<user@example.com>"
  }
}
Items Management
Get Items
Endpoint: GET /items

Description: Retrieve a list of items.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Query Parameters:

page (integer, optional): Page number for pagination.
limit (integer, optional): Number of items per page.
Response:

json
Copy code
{
  "items": [
    {
      "id": "item_id",
      "name": "Item Name",
      "description": "Item Description",
      "createdAt": "2023-01-01T00:00:00Z"
    }
    // More items...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
Create Item
Endpoint: POST /items

Description: Create a new item.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Request Body:

json
Copy code
{
  "name": "New Item",
  "description": "Description of the new item"
}
Response:

json
Copy code
{
  "message": "Item created successfully",
  "item": {
    "id": "item_id",
    "name": "New Item",
    "description": "Description of the new item",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
Update Item
Endpoint: PUT /items/:id

Description: Update an existing item.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Parameters:

id (string): ID of the item to update.
Request Body:

json
Copy code
{
  "name": "Updated Item Name",
  "description": "Updated description"
}
Response:

json
Copy code
{
  "message": "Item updated successfully",
  "item": {
    "id": "item_id",
    "name": "Updated Item Name",
    "description": "Updated description",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
Delete Item
Endpoint: DELETE /items/:id

Description: Delete an item.

Headers:

makefile
Copy code
Authorization: Bearer YOUR_JWT_TOKEN
Parameters:

id (string): ID of the item to delete.
Response:

json
Copy code
{
  "message": "Item deleted successfully"
}
Error Handling
Errors are returned with appropriate HTTP status codes and a JSON response:

json
Copy code
{
  "error": {
    "status": 400,
    "message": "Detailed error message"
  }
}
Common Error Codes:

400 Bad Request: Invalid request parameters.
401 Unauthorized: Authentication failed or missing token.
403 Forbidden: Insufficient permissions.
404 Not Found: Resource not found.
500 Internal Server Error: Server-side error.
Examples
Login Example
bash
Copy code
curl -X POST <https://api.yourapp.com/v1/auth/login> \
  -H "Content-Type: application/json" \
  -d '{
    "email": "<user@example.com>",
    "password": "your_password"
  }'
Get Items Example
bash
Copy code
curl -X GET <https://api.yourapp.com/v1/items?page=1&limit=10> \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Create Item Example
bash
Copy code
curl -X POST <https://api.yourapp.com/v1/items> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Item",
    "description": "Description of the new item"
  }'
Contact
For any questions or issues, please contact the backend team:

Email: <backend-team@yourapp.com>
Slack: #backend-support
