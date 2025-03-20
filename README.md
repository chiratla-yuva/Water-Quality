# Smart Aquaculture Monitoring System

## Overview
This project is a **real-time monitoring system** for water quality in aquaculture, focusing on **pH and temperature** using **IoT-based Wireless Sensor Networks (WSNs)**. It collects, processes, and displays sensor data using the **MERN stack**.

### Features:
- **Real-time pH and Temperature Monitoring**
- **Wireless Sensor Network using Arduino Uno & ESP8266 NodeMCU**
- **Data Storage with MongoDB (via REST API)**
- **Bar Chart for Live Sensor Readings**
- **Historical Data Visualization**
- **Admin Portal for User Management (In Progress)**
- **Alert System for Abnormal Sensor Values (In Progress)**

## Technologies Used
- **Hardware:** Arduino Uno, ESP8266 NodeMCU, pH Sensor, DS18B20 Temperature Sensor
- **Frontend:** React.js (MERN Stack)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via REST API)
- **Communication Protocol:** UART (Arduino ↔ ESP8266)

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- MongoDB Compass
- Arduino IDE

### Backend Setup
```sh
cd backend
npm init -y
npm install express cors bcryptjs mongoose jsonwebtoken dotenv body-parser cookie-parser nodemon nodemailer otp-generator
npm start
```

### Frontend Setup
```sh
cd frontend
npm create vite@latest
npm install
npm install axios react-router-dom tailwindcss @tailwindcss/vite react-toastify recharts lucide-react
npm run dev
```

### Upload Code to Arduino & ESP8266
- Use **Arduino IDE** to upload the code to the **Arduino Uno**.
- Upload the **ESP8266 NodeMCU** firmware using **ESP8266Flasher**.

## Remaining Features to Implement
- **Admin Portal Enhancements:**
  - Adding User Management (Add, Edit, Delete Users)
  - User Data Table for Admins
- **Alert Message System:**
  - Trigger an alert when a sensor value exceeds safe thresholds.
  - Alert message should include:
    - Which value is beyond the range.
    - Recommended actions to take immediately.
  - Alert system should notify admins via UI (and optionally email/SMS in future versions).
