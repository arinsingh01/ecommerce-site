# Amplitude E-Commerce Website

## Overview
Amplitude is a full-stack e-commerce website built with Node.js, Express, MongoDB, and vanilla JavaScript. It features user authentication, product browsing, cart management, and order placement.

## Features
- **User Authentication:** Login and registration with JWT.
- **Product Browsing:** View products, filter, and search.
- **Cart Management:** Add, update, and remove items from the cart.
- **Order Placement:** Checkout with shipping and payment details.
- **User Profile:** View and update user information.
- **Contact Form:** Send inquiries to the admin.

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd amplitude
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb+srv://alexwillclaim:CteXSEPicdqw1ABQ@amplitude.vav4zdj.mongodb.net/?retryWrites=true&w=majority&appName=amplitude
   PORT=3005
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Access the application:**
   Open your browser and navigate to `http://localhost:3005`.

## API Endpoints
- **Authentication:**
  - `POST /api/auth/login`: Login user
  - `POST /api/auth/register`: Register user
- **Products:**
  - `GET /api/products`: Get all products
  - `GET /api/products/:id`: Get product by ID
- **Cart:**
  - `GET /api/cart`: Get cart items
  - `POST /api/cart/add`: Add item to cart
  - `POST /api/cart/update`: Update cart item
  - `POST /api/cart/remove`: Remove item from cart
- **Orders:**
  - `POST /api/orders`: Place order
- **Contact:**
  - `POST /api/contact`: Send contact message

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT

## Future Improvements
- Add user roles (admin, customer)
- Implement product reviews and ratings
- Add payment gateway integration
- Enhance UI/UX with animations and transitions

## License
This project is licensed under the MIT License.

## Project Structure
```
amplitude/
├── public/
│   ├── images/
│   ├── css/
│   └── js/
├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
├── server/
│   ├── controllers/
│   ├── models/
│   └── routes/
└── docs/
    └── design/
```

## Development Team
- Created as part of the Web Development Assignment 

## Environment Variables
- MONGODB_URI: mongodb+srv://alexwillclaim:CteXSEPicdqw1ABQ@amplitude.vav4zdj.mongodb.net/?retryWrites=true&w=majority&appName=amplitude
- PORT: 3005
- JWT_SECRET: your_jwt_secret
- NODE_ENV: development 