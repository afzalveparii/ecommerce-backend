# E-commerce Backend

This is the backend code for the E-commerce application built with Node.js, Express, and MongoDB. It handles user authentication, product management, cart functionality, order processing, and Stripe payments.

## Features

- User authentication and authorization (JWT-based)
- Product management (CRUD operations)
- Cart functionality (Add, update, and remove items)
- Order management (Create, view, and update orders)
- Payment integration using Stripe API
- Session handling with secure cookies

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user, product, and order data
- **Mongoose**: ODM for MongoDB to interact with database
- **Stripe API**: For handling payments
- **JWT (JSON Web Tokens)**: For secure user authentication
- **Passport.js**: For user authentication
- **Session**: For managing user sessions and cookies

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/afzalveparii/ecommerce-backend.git

2. Navigate to the project directory:

   ```bash
   cd ecommerce-backend

3. Install dependencies:
     ```bash
     npm install
4. Set up environment variables by creating a .env file in the root of the project with the following variables:
   ```bash
   PORT=your_port
    DATABASE=your_mongoDB_connection_string
    STRIPE_API_KEY=your_stripe_api_key
    ENDPOINT_SECRET=your_stripe_endpoint_secret
    SESSION_KEY=your_session_key
    JWT_SECRET_KEY=your_jwt_secret_key

5. Start the development server:
   ```bash
   npm run dev

6. The server will start at the specified PORT in the .env file.
