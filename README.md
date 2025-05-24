# 🛠️ Smart Drainage Monitoring System 🌐💧

A full-stack IoT-based Smart Drainage Monitoring System that enables real-time monitoring of drainage manholes using gas, water level, and pH sensors. The system helps city administrators track hazardous areas, receive citizen feedback, and assign maintenance workers efficiently via a web-based dashboard and mobile view.

---

## 🚀 Features

- 🔍 **Real-Time Sensor Monitoring** (gas, level, pH)
- 🗺️ **Interactive Map Interface** (powered by MapLibre + OpenRouteService)
- 🧭 **Shortest Route Calculations** for emergency response
- 👷 **Worker Assignment Logic** based on location & availability
- 📣 **Citizen Feedback System** via QR scan
- 📦 **Cloud Image Upload** using Cloudinary
- 📡 **IoT Integration** with MQTT
- 🔐 **JWT Auth & Google OAuth Login**
- 📊 **Admin Dashboard** with dynamic analytics, charts & tables
- 📱 **Responsive Mobile Interface**

---

## 🏗️ Tech Stack

### 💻 Frontend

- **React.js**
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form**, **Zod** (form validation)
- **Redux Toolkit**, **Zustand** (state management)
- **React Router DOM**
- **Socket.IO Client**
- **Maplibre GL**, **React-Map-GL**
- **OpenRouteService API**
- **Recharts**, **ApexCharts**
- **Framer Motion** (animation)
- **XLSX.js** (Excel export)

### 🧠 Backend

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **JWT Authentication**
- **BcryptJS**
- **Socket.IO**
- **Cloudinary**
- **Mailtrap Email Testing**
- **MQTT.js**
- **CORS**, **Dotenv**, **Cookie-Parser**

---

## 📁 Folder Structure

```
smart-drainage/
├── api/ # Backend (Node.js + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── .env
├── client/ # Frontend (React + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.local
├── package.json
├── .gitignore
└── README.md
```

---

## 🔑 Environment Variables

### 📦 Backend (`api/.env`)

```env
MONGO_URI=your_mongo_connection
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_secret
CLOUD_NAME=your_cloudinary_name
MAILTRAP_API_TOKEN=your_mailtrap_token
FRONTEND_URL=http://localhost:5173
MQTT_TOPIC=drainage-sensors
MQTT_BROKER_URL=mqtt://broker.hivemq.com
PORT=8000
```

### 💻 Frontend (`client/.env.local`)

```env
VITE_MAP_API_KEY=your_map_api_key
VITE_GOMAP_API_KEY=your_openrouteservice_api_key
VITE_API_KEY=your_geoapify_key
VITE_MAP_STYLE=your_map_style_url

BETTER_AUTH_SECRET=your_auth_secret
DATABASE_URL=your_mongodb_connection
BETTER_AUTH_URL=http://localhost:8000/api/auth
EMAIL_VERIFICATION_CALLBACK_URL=http://localhost:5173/verify-email
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
```

---

## 🧪 How to Run Locally

### 📦 Backend

```bash
cd api
npm install
npm run dev
```

### 💻 Frontend

```bash
cd client
npm install
npm run dev
```

Ensure both `.env` and `.env.local` are properly configured.

---

## 🛰️ IoT Hardware Overview

- 💨 **Gas Sensor** – detects toxic gases like methane or CO₂
- 🌊 **Level Sensor (Ultrasonic)** – monitors water overflow
- 🧪 **pH Sensor** – detects chemical levels in wastewater
- 📶 **ESP8266** – sends sensor data via MQTT
- 📲 Data transmitted and saved to MongoDB via backend

---

## 🔄 Data Flow

```
[Sensor Node] → MQTT → [Backend] → MongoDB
   ↑                            ↓
[Frontend Map & Dashboard] ← Socket.IO
```

---

## 📲 QR Feedback Flow

1. QR code printed and placed on manholes.
2. Citizens scan QR → redirected to web form.
3. Feedback sent to backend.
4. Admin reviews and assigns to nearby worker.

---

## 📉 Future Enhancements

- 🔍 Machine Learning to classify & predict overflow/gas risk
- 📱 Native mobile app
- 🗂️ Sensor diagnostics panel
- 🌐 Multilingual support
- 📬 SMS alerts for emergencies

---

## 📸 Screenshots

(Add some screenshots or GIFs showing your dashboard, map view, and mobile responsiveness here.)

---

## 👨‍💻 Author

**Mekin Jemal**  
📧 [mekinjemal999@gmail.com](mailto:mekinjemal999@gmail.com)  
📞 +251920064543  
🌐 [LinkedIn](https://linkedin.com/in/mekinjemal) | [GitHub](https://github.com/mekinjemal)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Geoapify](https://www.geoapify.com/)
- [OpenRouteService](https://openrouteservice.org/)
- [Cloudinary](https://cloudinary.com/)
- [Mailtrap](https://mailtrap.io/)
- [HiveMQ MQTT Broker](https://www.hivemq.com/public-mqtt-broker/)
