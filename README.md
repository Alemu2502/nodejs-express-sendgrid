Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Security](#security)
5. [Getting Started](#getting-started)
6. [Running The Application](#running-the-application)
7. [Api Endpoints](#api-endpoints)
8. [Testing via Postman](#testing-via-postman)
9. [Cron Jobs](#cron-jobs)
10. [Contribution](#contribution)
11. [Contact](#contact)
12. [License](#license)
13. [Conclusion](#conclusion)

# Overview

This project demonstrates the development of a robust RESTful API with comprehensive authentication, authorization, and security implementations using modern technologies like Node.js, Express.js, and MongoDB. The project ensures secure handling of user data and efficient API operations, adhering to industry best practices.

# Features

1. JWT (JSON Web Tokens) for secure user authentication
2. Email-based token verification for password resets and email verification after signup
3. Password encryption and hashing
4. Role-Based Access Control (RBAC) for restricted features
5. Scheduled tasks to remove unverified users
6. User data management with mongoose

# Technologies Used

##### Backend
1. Node.js
2. Express.js
3. MongoDB

# Security

1. **bcrypt:** Password encryption 
2. **jsonwebtoken:** JWT handling
3. **cookie-parser:** Secure cookie handling

# Getting Started

##### Prerequisites
1. Node.js
2. npm or yarn
3. MongoDB

Installation
Clone the repository

git clone https://github.com/Alemu2502/nodejs-express-sendgrid.git
- Navigate to the project directory

cd nodejs-express-sendgrid
-Install dependencies

npm install

-Set up environment variables

Create a .env file in the root directory and add the following:

env
- MONGO_URL= your-mongodb-url
- SECRET_KEY= your-secret-key
- SENDGRID_API_KEY= your-sendgrid-api-key
- EMAIL= your-email

##### Setting Up SendGrid
Create a SendGrid Account [here](https://signup.sendgrid.com/) if you don't have:

Go to SendGrid and sign up for a free account.

Generate API Key:

Once logged in, navigate to the API Keys section in the settings.

Click on Create API Key and provide a name for your key.

Set the permissions and create the key.

Copy the generated API key and add it to your .env file as SENDGRID_API_KEY.

# Running the Application
Start the development server

npm start
The server will be running at http://localhost:3000

# API Endpoints
1. ##### User Authentication and Management
POST /users/register: Register a new user and send email verification

POST /users/login: Login a user

POST /users/forgot-password: Request password reset

POST /users/reset-password/:token: Reset password using token

POST /users/verify-email/:token: Verify user email

2. ##### Task Management
GET /tasks: Retrieve all tasks

POST /tasks: Create a new task

GET /tasks/:taskId: Retrieve a task by ID

PATCH /tasks/:taskId: Edit a task by ID

DELETE /tasks/:taskId: Delete a task by ID

3. ##### Protected Routes
GET /users/protected: Access a protected route (requires authentication)

4. ##### Role-Based Access Control (RBAC)
POST /admin/create-user: Admin creates a new user (requires Admin role)

DELETE /admin/delete-user/:_id: Admin deletes a user (requires Admin role)

PATCH /editor/update-user/:_id: Editor updates a user (requires Editor role)

GET /user/view-user: View user details (requires Admin, Editor, or User role)

# Testing via Postman
To test the API, use Postman or any API testing tool to make requests to the endpoints. Here are some example requests:

1. ##### User Registration
URL: http://localhost:3000/users/register

Method: POST

Body:

json
{
  "name": "Alemu Molla",
  "email": "alemu@example.com",
  "password": "password123",
  "passwordCheck": "password123",
  "role": "User"
}

2. ##### User Login
URL: http://localhost:3000/users/login

Method: POST

Body:

json
{
  "email": "alemu@example.com",
  "password": "password123"
}

3. ##### Forgot Password
URL: http://localhost:3000/users/forgot-password

Method: POST

Body:

json
{
  "email": "alemu@example.com"
}

4. ##### Reset Password
URL: http://localhost:3000/users/reset-password/<token>

Method: POST

Body:

json
{
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

5. ##### Verify Email
URL: http://localhost:3000/users/verify-email/<token>

**Method: POST**

**Check Server Health**
URL: http://localhost:3000/health

Method: GET

# Cron Jobs
User Cleanup: Scheduled tasks to remove unverified users after a certain period.

# Contribution

Feel free to contribute to this project by creating a pull request or opening an issue.

# Contact
For any questions, suggestions, or collaboration opportunities, feel free to connect with me through the following channels:

- Email: alemu4617@gmail.com
- LinkedIn: https://www.linkedin.com/in/Alemu2502 - Connect with me professionally.
- Facebook: https://www.facebook.com/alemu.molla.1806
- Twitter: https://twitter.com/ALEXSEPPRO

Follow me for updates and insights.

# License

Distributed under the MIT License.

# Conclusion

This project showcases the development of a robust RESTful API with comprehensive authentication, authorization, and security features using modern technologies like Node.js, Express.js, and MongoDB. It highlights secure handling of user data, email-based token verification for both password resets and account verification, password encryption, and role-based access control. By implementing these best practices, the application ensures a secure, efficient, and scalable backend solution.