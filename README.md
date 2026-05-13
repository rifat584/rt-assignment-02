# Assignment 02

A simple modular Express.js backend built with TypeScript. This project currently focuses on the foundation of an authentication module, request validation with Zod, centralized routing, and basic middleware setup.

## Overview

This project is structured as a small REST API starter with:

- Express 5 for the HTTP server
- TypeScript for type safety
- Zod for request validation
- `http-status` for readable status code handling
- `dotenv` for environment configuration
- `cookie-parser` and `cors` middleware support

At the moment, the authentication module is scaffolded and returns placeholder data from the service layer. That makes this repository a good starting point for learning modular backend architecture and extending it into a full authentication system.

## Features

- Modular folder structure
- Versioned API base path: `/api/v1`
- Auth module with separated route, controller, service, and validation files
- Request body validation middleware using Zod
- Global 404 handler for unknown routes
- Environment-based port configuration
- TypeScript development workflow with `tsx`

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Zod
- pnpm

## Project Structure

```text
src/
├── app.ts
├── server.ts
├── app/
│   ├── middleware/
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.route.ts
│   │       ├── auth.service.ts
│   │       └── auth.validation.ts
│   └── routes/
│       └── routes.ts
├── config/
│   └── env.ts
├── types/
│   └── response.ts
└── utils/
    └── ApiResponse.ts
```

## How It Works

The application starts from `src/server.ts`, boots the Express app from `src/app.ts`, and listens on the configured port.

The root route:

```http
GET /
```

returns:

```json
{
  "message": "Successful"
}
```

All API routes are grouped under:

```text
/api/v1
```

The auth routes are mounted under:

```text
/api/v1/auth
```

## Auth Endpoints

The current auth module contains the following routes:

### 1. Login

```http
GET /api/v1/auth/login
```

Validation:

- expects a valid email in the request body

Current response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": "email@com"
}
```

### 2. Register

```http
GET /api/v1/auth/register
```

Current response:

```json
{
  "success": true,
  "message": "Register Successful",
  "data": {
    "name": "Rifat",
    "email": "rifat@gmail.com"
  }
}
```

### 3. Change Password

```http
GET /api/v1/auth/change-password
```

Current response:

```json
{
  "success": true,
  "message": "Password Changed Successfully",
  "data": {
    "oldPassword": "old",
    "newPassword": "new",
    "confirmNewPassword": "confirmed"
  }
}
```

### 4. Forgot Password

```http
GET /api/v1/auth/forgot-password
```

Current response:

```json
{
  "success": true,
  "message": "Password reset mail sent!",
  "data": "myemail@gmail.com"
}
```

## Validation

Request validation is handled by `src/app/middleware/validateRequest.ts` using Zod schemas from the auth module.

Currently defined validation rules:

- `loginSchema`: validates email format
- `registerSchema`: validates `name` with minimum 3 characters
- `forgotPasswordSchema`: validates email format
- `changePasswordSchema`:
  - requires `oldPassword`
  - requires `newPassword` with minimum 6 characters
  - requires `confirmNewPassword`
  - checks that `newPassword` and `confirmNewPassword` match

If validation fails, the API returns a `400 Bad Request` response like:

```json
{
  "success": false,
  "message": "Validation error message",
  "error": [
    {
      "path": [],
      "message": "Validation details"
    }
  ]
}
```

## Not Found Handler

If a route does not exist, the app returns a structured `404` response:

```json
{
  "success": false,
  "message": "Api not found",
  "error": {
    "path": "/requested/path",
    "message": "Your requested path was not found"
  }
}
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
```

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rifat584/rt-assignment-02
cd assignment-02
pnpm install
```

## Running the Project

### Development

```bash
pnpm dev
```

This runs the server with file watching using `tsx`.

### Production Build

```bash
pnpm build
```

### Start Built Version

```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - run the app in development mode
- `pnpm build` - compile TypeScript to JavaScript
- `pnpm start` - run the compiled app from `dist/server.js`

## API Testing

You can test the API using Postman, Insomnia, or `curl`.

Example:

```bash
curl http://localhost:5000/
```

Example auth route:

```bash
curl http://localhost:5000/api/v1/auth/register
```


