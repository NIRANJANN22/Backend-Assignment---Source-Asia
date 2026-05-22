# Source Asia Backend Assignment

## Overview
This project implements two required backend services:
1. **Rate-limited API** - Limits requests to 5 per user per minute
2. **Product Catalog API** - CRUD operations for products with media URLs

## Technologies
- Node.js (v18+)
- Express.js
- In-memory storage (Map objects)
- UUID for ID generation

## Setup & Installation

```bash
# Clone repository
git clone https://github.com/vikrammadhikunta/niranjan_sourceasia.git
cd source-asia-backend

# Install dependencies
npm install

# Start server
npm start

# Development with auto-reload
npm run dev
