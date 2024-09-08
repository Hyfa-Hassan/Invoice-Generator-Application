Invoice Generator Application

Overview
This is a full-stack Invoice Generator application built with Node.js, Express.js, and MongoDB. It allows users to create and download invoices in both PDF and image formats. The application is containerized using Docker and deployed on Render.

Features
    User Authentication: Secure login and registration with JWT.
    Add Products: Input products and generate invoices with GST calculation.
    View Quotations: List all generated invoices and download them.
    Generate PDF and Image: Generate invoices in both PDF and image formats.

Technologies Used
    Node.js: JavaScript runtime for server-side logic.
    Express.js: Web framework for building APIs.
    MongoDB: NoSQL database for storing data.
    Puppeteer: Library for generating PDFs and images from HTML content.
    Docker: Containerization for consistent deployment.
    Render: Cloud platform for deploying Docker applications.


Getting Started

Prerequisites
    Docker installed on your machine.
    Node.js installed (optional for local development).
    Access to a MongoDB instance (local or cloud).

Installation
    Clone the Repository:
        git clone <your-repository-url>
        cd <repository-folder>
    Install node_modules
        npm install
    Run the code localy
        npm run dev
    Build Docker Image:
        docker build -t invoice-generator .
    Run Docker Container:
        docker run -p 5001:5001 invoice-generator

API Endpoints
    POST /login: Authenticate user.
        Request body: { "email": "user@example.com", "password": "password123" }
        Response: { "token": "jwt-token" }

    POST /register: Register a new user.
        Request body: { "name": "User Name", "email": "user@example.com", "password": "password123" }
        Response: { "message": "User registered successfully" }
    
    POST /products: Add products and generate an invoice.
        Headers: Authorization: Bearer <token>
        Request body: { "products": [{ "name": "Product1", "qty": 10, "rate": 100 }] }
        Response: { "message": "Invoice generated", "pdfUrl": "url-to-pdf", "imageUrl": "url-to-image" }

    GET /quotations: View all quotations.
        Headers: Authorization: Bearer <token>
        Response: { "quotations": [{ "name": "Product1", "qty": 10, "rate": 100, "total": 1180 }] }


Deployment
    Deploy on Render:
        Create a Render account.
        Create a new web service and connect to your GitHub repository.
        Render will automatically detect the Dockerfile and deploy the application.
    Configure Environment Variables:
        Set up required environment variables such as MONGO_URI, JWT_SECRET, etc.