# 👓 Lens E-Commerce Web App

A full-stack e-commerce platform for browsing and purchasing different types of lenses, including gray photochromic, blue light, and fashion frames. Built with React for the frontend and Node.js + Express for the backend.

---

## 🚀 Features

* 🛍️ Browse a variety of lenses (gray, blue light, brown, etc.)
* 🔍 View detailed product descriptions and benefits
* 🛒 Add to cart and manage items
* 💳 Checkout system (basic or integrated depending on setup)
* 👤 User-friendly interface
* ⚡ Fast and responsive design

---

## 🧱 Tech Stack

**Frontend**

* React.js
* CSS / Tailwind (if used)

**Backend**

* Node.js
* Express.js

**Other Tools**

* REST API
* (Optional) MongoDB / Database of your choice

---

## 📁 Project Structure

/client     → React frontend
/server     → Node.js + Express backend

---

## ⚙️ Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/asamoah953/chromalens.git
cd lens-ecommerce
```

---

### 2. Install dependencies

#### Install frontend

```bash
cd client
npm install
```

#### Install backend

```bash
cd ../server
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the `/server` folder and add:

```env
PORT=5000
MONGO_URI=your_database_connection
```

---

### 4. Run the application

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd client
npm start
```

---

### 🌐 App will run on:

* Frontend: http://localhost:3000
* Backend: http://localhost:5000

---

## 🔄 How It Works

1. The user visits the React frontend.
2. Products (lenses) are fetched from the backend API.
3. Users can:

   * Browse lenses
   * View details
   * Add items to cart
4. The frontend communicates with the Express backend via HTTP requests.
5. The backend handles:

   * Product data
   * User actions
   * Database operations

---

## 📦 Deployment

### Frontend (Vercel)

* Deploy the `/client` folder on Vercel

### Backend

* Deploy separately (e.g., Railway, Render, or any Node.js host)

---

## 🧠 Future Improvements

* User authentication (login/signup)
* Payment integration (Stripe, Paystack, etc.)
* Order tracking system
* Admin dashboard

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Your Name
GitHub: https://github.com/asamoah953

---
