# school-payments
A full-stack application for managing school payments and transactions, built with NestJS backend and React 

# Features
## Backend

Complete REST API for managing school transactions
JWT Authentication
MongoDB integration
Webhook integration for payment status updates
Transaction management system
School-wise transaction filtering

## Frontend

Responsive dashboard interface
Real-time transaction monitoring
Advanced filtering and search capabilities
Dark/Light theme support
School-specific transaction views

# Tech Stack
## Backend

NestJS
MongoDB
JWT for authentication
TypeScript

## Frontend

React (Vite)
Tailwind CSS
Axios
React Router

# Getting Started
## Prerequisites

Node.js (v16 or higher)
MongoDB
npm or yarn
Git

# Installation

Clone the repository
```bash
git clone [repository-url]
cd school-payments
```
Install Backend Dependencies
```bash
cd backend
npm install
```
Install Frontend Dependencies
```bash
npm install
```

# Environment Variables
Create a .env file in the backend directory with the following variables:
```bash
 MONGODB_URI=mongodb+srv://test-user:edviron@edvironassessment.ub8p5.mongodb.net/?retryWrites=true&w=majority&appName=edvironAssessment

# JWT Configuration
JWT_SECRET=your_very_secret_key_here_change_in_production
JWT_EXPIRATION=30d

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Application Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# API Configuration
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PG_KEY=edvtest01
API_KEY=your_api_key_here
```

# API Documentation
Authentication

POST /auth/login - User authentication
POST /auth/refresh - Refresh JWT token

Transactions

GET /transactions - Fetch all transactions
GET /transactions/school/:schoolId - Get transactions by school
GET /transactions/status/:customOrderId - Check transaction status
POST /transactions/webhook - Webhook for status updates
POST /transactions/update-status - Manual status update

 