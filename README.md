# Gehe.fyi Frontend

This is the frontend for the [Gehe.fyi](https://gehe.fyi/) project, a URL shortener bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

Edit the page by modifying `app/page.js`. The page updates automatically as you make changes.

This project utilizes [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) for automatic optimization and loading of the Inter font from Google Fonts.

## Backend Server API Documentation

This section is for frontend developers who need to interact with the backend APIs.

### Base URL

All API requests should be sent to:

```
https://api.yourapp.com/v1
```

### Authentication

All endpoints, except for login and registration, require authentication using a JSON Web Token (JWT). Include the token in the Authorization header:

```makefile
Authorization: Bearer YOUR_JWT_TOKEN
```

### API Endpoints

#### User Authentication

- **Login**
  - **Endpoint:** POST /auth/login
  - **Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```

  - **Response:**

    ```json
    {
      "token": "jwt_token",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
    ```

- **Register**
  - **Endpoint:** POST /auth/register
  - **Body:**

    ```json
    {
      "name": "John Doe",
      "email": "user@example.com",
      "password": "your_password"
    }
    ```

  - **Response:**

    ```json
    {
      "message": "User registered successfully",
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com"
      }
    }
    ```

#### User Profile

- **Get User Profile**
  - **Endpoint:** GET /users/me
  - **Headers:**

    ```makefile
    Authorization: Bearer YOUR_JWT_TOKEN
    ```

  - **Response:**

    ```json
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "createdAt": "2023-01-01T00:00:00Z"
    }
    ```

- **Update User Profile**
  - **Endpoint:** PUT /users/me
  - **Headers:**

    ```makefile
    Authorization: Bearer YOUR_JWT_TOKEN
    ```

  - **Body:**

    ```json
    {
      "name": "Jane Doe",
      "password": "new_password"
    }
    ```

  - **Response:**

    ```json
    {
      "message": "Profile updated successfully",
      "user": {
        "id": "user_id",
        "name": "Jane Doe",
        "email": "user@example.com"
      }
    }
    ```

#### Items Management

- **Get Items**
  - **Endpoint:** GET /items
  - **Headers:**

    ```makefile
    Authorization: Bearer YOUR_JWT_TOKEN
    ```

  - **Query Parameters:** Page (integer, optional), Limit (integer, optional)
  - **Response:**

    ```json
    {
      "items": [
        {
          "id": "item_id",
          "name": "Item Name",
          "description": "Item Description",
          "createdAt": "2023-01-01T00:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "totalItems": 50
      }
    }
    ```

- **Create Item**
  - **Endpoint:** POST /items
  - **Headers:**

    ```makefile
    Authorization: Bearer YOUR_JWT_TOKEN
    ```

  - **Body:**

    ```json
    {
      "name": "New Item",
      "description": "Description of the new item"
    }
    ```

  - **Response:**

    ```json
    {
      "message": "Item created successfully",
      "item": {
        "id": "item_id",
        "name": "New Item",
        "description": "Description of the new item",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    }
    ```

#### Error Handling

Errors are returned with appropriate HTTP status codes and a JSON body:

```json
{
  "error": {
    "status": 400,
    "message": "Detailed error message"
  }
}
```

#### Contact

For any questions or issues, contact the backend team:

- Email: <backend-team@yourapp.com>
- Slack: #backend-support
