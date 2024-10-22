# Quiz Application API

## Overview
This is a RESTful API for a Quiz Application built using Node.js and Express.js. The application allows users to create quizzes, take quizzes, manage user authentication, and verify email addresses using OTP (One Time Password).

## Features
- User Registration and Login
- Password Hashing
- Email Verification with OTP
- Create, Retrieve, Update, and Delete Quizzes
- Submit Quiz Answers and Receive Scores
- JWT-based Authentication

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt.js
- Nodemailer
- OTP Generator

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (v4.0 or later)
- A Gmail account for sending emails (or configure with your email service)

### Installation
1. Clone the repository:
   git clone <repository_url>
   cd <repository_name>

2. Install the dependencies:
npm install

3. Set up environment variables in a .env file:
PORT=3000
MONGODB_URI=
AUTH_EMAIL=
AUTH_PASS=
SECRET_KEY=your_jwt_secret_key

4. Running the Application
To start the application, run:

npm start
The server will start on the port specified in your environment variables (default is 3000).

#### API Endpoints
1. User Authentication
Sign Up

POST /api/auth/signup
Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "YourPassword123!",
  "name": "Your Name",
  "type": "user"
}
Log In

POST /api/auth/login
Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "YourPassword123!"
}
Forgot Password

POST /api/auth/forgot-password
Body:
json
Copy code
{
  "email": "user@example.com"
}
Verify OTP

POST /api/auth/otp-verify
Body:
json
Copy code
{
  "otp": "1234"
}
Change Password

PATCH /api/auth/change-password
Body:
json
Copy code
{
  "newpassword": "YourNewPassword123!"
}

2. Quiz Management
Create Quiz

POST /api/quizzes
Body:
json
Copy code
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": [
        {
          "text": "Option A",
          "correct": true
        },
        {
          "text": "Option B",
          "correct": false
        }
      ]
    }
  ]
}
Get All Quizzes

GET /api/quizzes
Get Quiz Details

GET /api/quizzes/:id
Submit Quiz

POST /api/quizzes/:id/submit
Body:
json
Copy code
{
  "answers": ["Option A", "Option B"]
}
Delete Quiz

DELETE /api/quizzes/:id