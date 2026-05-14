# Assignment 02

A modular Express.js backend built with TypeScript. The current codebase focuses on API structure, authentication module scaffolding, reusable response formatting, request validation, and centralized error handling. Prisma and PostgreSQL are planned for a future version, but they are not integrated yet.

## ERD

[View the ERD diagram](https://drive.google.com/file/d/1rGvyNJtd2n8ZRgIJCpmWjZ8-tn_zpoV8/view?usp=sharing)

## Database Concepts Q&A

### 1. Primary Key vs. Foreign Key

- **Primary Key (PK):** A column (or set of columns) that uniquely identifies every row in a table. It cannot contain `NULL` values, and there can only be one PK per table. Think of it as a definitive ID number.
- **Foreign Key (FK):** A column in one table that links to the Primary Key of another table. It acts as a bridge to establish a relationship between the two tables and enforces referential integrity, ensuring you cannot have an orphaned record that points to a non-existent primary key.

### 2. The Importance of Normalization

Normalization is the process of organizing data to minimize redundancy (duplicate data) and prevent data anomalies (errors during insertion, updating, or deletion).

By breaking large tables into smaller, related tables, you ensure that a piece of information is stored in exactly one place. This is crucial in relational systems like SQLite or PostgreSQL because it keeps the database efficient, maintains strict data integrity, and makes updates much safer.

### 3. What is a JOIN?

A `JOIN` is a SQL operation used to combine rows from two or more tables based on a related column between them, usually a Primary Key to Foreign Key relationship. Since normalization splits data apart, `JOIN` is the mechanism used to stitch it back together for queries.

### 4. SQL vs. MongoDB

This is the fundamental difference between relational and document databases.

| Feature | SQL (Relational) | MongoDB (NoSQL/Document) |
| --- | --- | --- |
| **Structure** | Tables, rows, and columns. | Collections of BSON/JSON documents. |
| **Schema** | Rigid and predefined. | Flexible and dynamic; documents in the same collection can have different structures. |
| **Relationships** | Strongly enforced via Foreign Keys and JOINs. | Often handled by embedding data within the document or using reference IDs like `ObjectId`. |
| **Scaling** | Typically scales **vertically** by adding more CPU/RAM to a single server. | Built to scale **horizontally** by distributing data across multiple servers. |

### 5. Composite Key

A composite key is a Primary Key made up of **two or more columns** combined to guarantee uniqueness. While neither column is unique on its own, their combination is.

- *Example:* In a `ClassRoster` table, `StudentID` might repeat because a student takes multiple classes, and `ClassID` might repeat because a class has multiple students. However, the combination of `(StudentID, ClassID)` is unique and can serve as the composite key.

### 6. Weak Entity

A weak entity is a piece of data that cannot be uniquely identified by its own attributes alone. It depends on the existence of an owner entity, or strong entity, to exist.

- *Example:* A `Room` in a `Building`. If the `Building` is demolished, the `Room` ceases to exist. The room's identifier, such as Room 101, is only meaningful when combined with the building's Primary Key.

### 7. Why Do We Use Constraints?

Constraints are rules strictly enforced by the database engine to limit the type of data that can go into a table. They are the ultimate safety net to ensure accuracy and reliability. Common constraints include `NOT NULL` for required values, `UNIQUE` to prevent duplicates, and `CHECK` to ensure values meet a specific condition like `Age >= 18`.

### 8. Many-to-Many Relationship

This occurs when multiple records in Table A can relate to multiple records in Table B.

- *Example:* Authors and Books. An author can write multiple books, and a book can have multiple authors.
- **How it's solved:** In relational databases, you cannot resolve this directly. You must create a **junction table** or join table that sits between them, holding the Primary Keys of both tables as Foreign Keys.

### 9. Clustered vs. Non-Clustered Index

Indexes drastically speed up data retrieval, acting like the index at the back of a textbook.

- **Clustered Index:** Dictates the **actual physical sorting order** of the data on disk. Because data can only be physically sorted one way, a table can only have **one** clustered index, usually automatically created on the Primary Key.
- **Non-Clustered Index:** A separate data structure from the actual table. It contains a sorted list of the indexed columns along with pointers, like page numbers, to the actual data rows. You can have **multiple** non-clustered indexes on a table to speed up various queries.

### 10. Database Sharding vs. Partitioning

Both techniques manage large datasets, but they solve different problems.

- **Partitioning:** Dividing a single large table into smaller, more manageable logical pieces **within the same database server**.
- *When to use:* Use it to improve query performance and maintenance on a single machine. For example, partitioning a massive logs table by year. Old years can be archived easily without scanning the whole table.
- **Sharding:** Distributing pieces of a database across **multiple distinct physical servers** through horizontal scaling. Each server, or shard, holds a subset of the total data.
- *When to use:* Use it when your dataset or traffic is so massive that it exceeds the hardware limits of a single server, such as CPU, RAM, or disk space. This is a complex architecture, though systems like MongoDB support sharding natively to handle massive, distributed applications.

## Overview

This project is a small backend starter built with a modular Express architecture. Right now, it is centered around an `auth` module and a few shared utilities that make the code easier to scale later.

The current codebase includes:

- Express 5 for the HTTP server
- TypeScript for type safety
- Zod for request validation
- `http-status` for readable status code constants
- `dotenv` for environment configuration
- `cors` and `cookie-parser` middleware
- a reusable `sendResponse` helper for consistent JSON responses
- a `catchAsync` helper for async controller error forwarding
- a global error handler middleware

The service layer is still returning placeholder data, so this repository should be treated as a foundation project rather than a complete production-ready auth system.

## Features

- Modular folder structure
- Versioned API base path: `/api/v1`
- Dedicated auth module with separated route, controller, service, and validation files
- Reusable response helper for consistent API output
- Zod-based request validation middleware
- Async error forwarding with `catchAsync`
- Centralized global error middleware
- Structured `404` response for unknown routes
- Environment-based configuration using `.env`
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
│   │   ├── globalError.ts
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
    ├── ApiResponse.ts
    └── catchAsync.ts
```

## How It Works

The application starts from `src/server.ts`, loads environment values from `src/config/env.ts`, and boots the Express app from `src/app.ts`.

Request flow:

1. Shared middleware is applied with `cors`, `express.json`, `cookie-parser`, and `express.urlencoded`.
2. The app exposes a health-style root route at `/`.
3. All API routes are mounted under `/api/v1`.
4. Module routes are connected from `src/app/routes/routes.ts`.
5. Controllers call service functions and return structured JSON responses through `sendResponse`.
6. Async controller errors can be forwarded with `catchAsync`.
7. Unexpected errors are handled by `globalError`.
8. Unknown routes fall through to `notFound`.

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

The auth module is mounted under:

```text
/api/v1/auth
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
```

### Variables Used

- `PORT` - the port used by the HTTP server
- `NODE_ENV` - enables extra error details in development mode

## API Response Pattern

Successful responses are returned through `src/utils/ApiResponse.ts` and follow this shape:

```json
{
  "success": true,
  "message": "Any success message",
  "data": {}
}
```

## Auth Endpoints

The current auth module contains scaffolded routes that demonstrate structure and flow rather than complete authentication logic.

### 1. Login

```http
GET /api/v1/auth/login
```

Current behavior:

- handled by `AuthController.login`
- wrapped with `catchAsync`
- returns placeholder login data from the service layer
- has a validation schema in the codebase, but the route validation is currently commented out

Current response:

```json
{
  "success": true,
  "message": "Login Successful",
  "data": "email@com"
}
```

### 2. Register

```http
GET /api/v1/auth/register
```

Current behavior:

- handled by `AuthController.register`
- wrapped with `catchAsync`
- validated by `validateRequestData(AuthValidation.registerSchema)`
- returns placeholder registration data from the service layer

Current response:

```json
{
  "success": true,
  "message": "Register successful",
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

Current behavior:

- handled by `AuthController.changePassword`
- returns placeholder password-change data
- has a validation schema defined, but the route is not currently using validation middleware

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

Current behavior:

- handled by `AuthController.forgotPassword`
- returns placeholder forgot-password data
- has a validation schema defined, but the route is not currently using validation middleware

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

Available schemas:

- `loginSchema`: validates email format
- `registerSchema`: validates `name` with a minimum of 3 characters
- `forgotPasswordSchema`: validates email format
- `changePasswordSchema`:
  - requires `oldPassword`
  - requires `newPassword` with a minimum of 6 characters
  - requires `confirmNewPassword`
  - ensures `newPassword` and `confirmNewPassword` match

Current route usage:

- `register` uses validation middleware
- `login` validation is present but commented out
- `change-password` and `forgot-password` schemas exist but are not wired to routes yet

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

## Error Handling

The project currently includes two main error-related middlewares:

- `globalError.ts` for centralized error responses
- `notFound.ts` for unmatched routes

When `NODE_ENV=development`, the global error handler includes extra debugging details such as the error object and stack trace.

Example `404` response:

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

Runs the server in watch mode using `tsx`.

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
- `pnpm build` - compile TypeScript into `dist`
- `pnpm start` - run the compiled app from `dist/server.js`

## API Testing

You can test the API using Postman, Insomnia, or `curl`.

Example root request:

```bash
curl http://localhost:5000/
```

Example auth route:

```bash
curl http://localhost:5000/api/v1/auth/register
```

## Current Status

This project is still in an early scaffold phase. Right now:

- auth routes still use `GET` instead of more RESTful methods like `POST` or `PATCH`
- service methods return hardcoded placeholder data
- there is no database integration yet
- there is no Prisma setup yet
- there is no PostgreSQL connection yet
- there is no password hashing
- there is no JWT-based authentication yet
- only the `register` route currently applies validation middleware
- `changePassword` and `forgotPassword` are not yet wrapped with `catchAsync`

## Future Plan

The next planned step is to extend this backend with Prisma and PostgreSQL.

After that, the project can grow into a more complete auth system with:

- proper RESTful route methods
- Prisma schema and database models
- PostgreSQL-backed service logic
- secure password hashing with `bcrypt`
- JWT authentication and authorization
- full validation coverage for all auth routes
- custom error classes and better exception handling
- automated tests for routes and middleware

## Author

Rifat
