# 📰 Online News Portal

A full-stack online news portal built with the MERN stack — featuring role-based dashboards for Admins and Authors, breaking news ticker, news search, and JWT-based authentication.

🌐 **Live Demo:** [https://online-news-portal-ahp.netlify.app](https://online-news-portal-ahp.netlify.app)  
🔗 **Backend API:** [https://news-portal-5d7d.onrender.com](https://news-portal-5d7d.onrender.com)

---

## 🚀 Features

- 🔐 User authentication — Register, Login with JWT (Access + Refresh Token)
- 🗞️ Breaking news ticker on homepage
- 🔍 News search by keyword
- 📋 Role-based dashboards — **Admin** and **Author/Reporter**
- 🖼️ Image upload via Cloudinary
- 📱 Fully responsive design with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| React Router DOM | Client-side routing |
| Redux Toolkit | Global state management |
| Axios | HTTP requests |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Cloudinary | Image storage |

---

## 🗂️ Project Structure

```
online-news-portal/
├── client/                   # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── store/            # Redux Toolkit store & slices
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Axios instance, helpers
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── server/                   # Express Backend
    ├── src/
    │   ├── routes/           # API route definitions
    │   ├── controllers/      # Route handler logic
    │   ├── models/           # Mongoose models
    │   ├── middlewares/      # Auth, error handlers
    │   ├── utils/            # JWT, cloudinary helpers
    │   └── index.js
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/online-news-portal.git
cd online-news-portal
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/news-portal

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### News
```
GET    /api/news               ?search=&category=&page=&limit=
GET    /api/news/:id
POST   /api/news               [author, admin]
PUT    /api/news/:id           [author, admin]
DELETE /api/news/:id           [admin]
```

### Admin
```
GET    /api/admin/users        [admin]
PUT    /api/admin/users/:id    [admin]
GET    /api/admin/news         [admin]
```

### Author
```
GET    /api/author/my-news     [author]
POST   /api/author/news        [author]
PUT    /api/author/news/:id    [author]
```

---

## 👥 User Roles

| Role | Access |
|---|---|
| **User** | Browse news, search |
| **Author** | Publish & manage own articles |
| **Admin** | Full control — users, all articles, dashboard stats |

---

## 🌐 Deployment

| Service | Platform |
|---|---|
| Frontend | [Netlify](https://netlify.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://mongodb.com/atlas) |
| Images | [Cloudinary](https://cloudinary.com) |

---

> Developed by **Asif Hasan** — Full Stack Developer
