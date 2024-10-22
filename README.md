# Splitwise

A simple expense sharing application built with Node.js, Express, and MongoDB, inspired by the popular Splitwise platform. This application allows users to manage their expenses, share them with friends, and keep track of amounts owed.

## Features

- User authentication (registration and login)
- Create, read, update, and delete expenses
- Share expenses with friends
- Calculate amounts owed based on sharing methods (equal, exact, percentage)
- Validation for all user inputs
- Token-based authentication for secure API access

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Validation:** express-validator
- **Authentication:** JWT (JSON Web Tokens)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or a MongoDB Atlas account)

### Steps

1. Clone the repository:

   git clone https://github.com/Amit3817/Splitwise.git
   cd Splitwise


2. Install the dependencies:

   npm install

3. Set up environment variables:

   Create a `.env` file in the root directory and add your MongoDB connection string and any other environment variables:

   PORT=5000
   DB_URL=
   JWT_SECRET=your_jwt_secret
   AUTH_EMAIL
   AUTH_PASS

4. Start the server:

   npm start

5. The server should be running at `http://localhost:5000`.

## API Endpoints

### Authentication

**POST** /api/users/signup - Register a new user
**POST** /api/users/login - Log in an existing user
**POST** /api/users/forgot-password - Request a password reset
**POST** /api/users/verify-otp - Verify the OTP for password reset
**PUT** /api/users/resend-otp - Resend the OTP for verification
**PUT** /api/users/change-password - Change the user's password

### Expenses

- **GET** `/api/expenses` - Get all expenses
- **POST** `/api/expenses` - Create a new expense
- **GET** `/api/expenses/:id` - Get details of an expense
- **PUT** `/api/expenses/:id` - Update an existing expense
- **DELETE** `/api/expenses/:id` - Delete an expense
- **GET** `/api/expense/balanced-sheet/download` -Download balanced Sheet

### Example Request Body for Creating an Expense

{
  "amount": 100,
  "sharedWith": [
    {
      "userId": "60d5ec49f0c2e75f8c0a5c42",
      "amountOwed": 50,
      "percentage": 50
    }
  ],
  "method": "percentage",
  "createdBy": "60d5ec49f0c2e75f8c0a5c42"
}

## Testing

You can use Postman or any other API testing tool to test the API endpoints. Make sure to include the JWT token in the headers for protected routes.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes and commit them (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request


## Acknowledgements

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [JWT](https://jwt.io)