# 💪 Calisthenics E-Commerce Platform

A full-stack web application that combines **fitness tracking + eCommerce**, enabling users to train with calisthenics and shop fitness equipment.

---

## 🚀 Live Demo

- Frontend: https://your-frontend-url.vercel.app  
- Backend: https://your-backend-url.onrender.com  

---

## ✨ Features

### 🏋️‍♂️ Calisthenics
- User Authentication (JWT + Cookies)
- Dashboard & Profile Management
- Progress Tracking (Image Upload)
- Exercise Levels (Beginner → Advanced)
- Attendance Tracking

### 🛒 E-Commerce
- Browse Products
- Add / Remove from Cart
- Order Management
- Search & Filters

### 🤖 Advanced (Optional)
- AI Recommendations
- Face Recognition Attendance
- Voice Assistant

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB / MySQL

**Tools**
- JWT Authentication
- Cloudinary / Multer
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure
root/
│── client/ # Frontend
│── server/ # Backend
│── README.md

---

## ⚙️ Environment Variables

### Frontend (`client/.env`)

VITE_API_URL=https://your-backend-url.onrender.com


### Backend (`server/.env`)
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

---

## 🧑‍💻 Installation & Setup

### Clone Repository
git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name

### Backend Setup

cd server
npm install
npm run dev


### Frontend Setup

cd client
npm install
npm run dev


---

## 🚀 Deployment

### Vercel (Frontend)
Create `vercel.json`:

{
"rewrites": [
{ "source": "/(.*)", "destination": "/" }
]
}


### Render (Backend)
- Create Web Service
- Add environment variables
- Start command:

npm start


---

## 🔌 API Endpoints

| Method | Endpoint             | Description        |
|--------|---------------------|--------------------|
| POST   | /api/auth/register  | Register user      |
| POST   | /api/auth/login     | Login user         |
| GET    | /api/products       | Get products       |
| POST   | /api/cart           | Add to cart        |

---

## 📸 Screenshots

(Add your screenshots here)

---

## 🔮 Future Improvements

- Payment Integration (Stripe / Razorpay)
- Mobile Optimization
- AI Workout Assistant
- Analytics Dashboard

---

## 🤝 Contributing


fork → clone → create branch → commit → push → pull request


---

## 🧑‍💻 Author

**Abhinav Kumar Chaudhary**

---

## 📄 License

MIT License

---

## ⭐ Support

Give this project a ⭐ if you like it!