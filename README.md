# Social Media Feed with Like and Comment

A full-stack social media feed application where users can create posts with text + images, follow/unfollow users, like posts, comment on posts, and view a paginated infinite scrolling feed.

---

## 🚀 Tech Stack
- React.js (Frontend)
- Node.js + Express.js (Backend)
- MongoDB + Mongoose (Database)
- Cloudinary (Image Upload)
- react-infinite-scroll-component (Infinite Scroll Feed)

---

## ✅ Features
- Create posts with text and image upload
- Follow / Unfollow users
- Like / Unlike posts
- Add comments on posts
- Infinite scrolling feed pagination
- MongoDB stores users, posts, likes, comments, and follow relationships

---

## 📂 Project Structure
```bash
SocialMediaFeed/
backend/
frontend/
```


---

## ⚙️ Backend Setup

### 1) Go to backend folder
```bash
cd backend
```

### 2) Install dependencies
```bash
npm install
```

### 3) Setup Environment Variables

Create a .env file inside backend/ folder.

You can copy from .env.example:
```bash
cp .env.example .env
```

Now update your .env with your Cloudinary credentials:
```bash
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/socialfeed

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4) Start backend server
```bash
npm run dev
```
Backend will run at:
👉 http://localhost:5001

## 🌱 Seed Sample Data (Users + Posts)

Run this inside `backend/`:

```bash
npm run seed
```

## 💻 Frontend Setup
### 1) Go to frontend folder
```bash
cd ../frontend
npm run seed
```

### 2) Install dependencies
```bash
npm install
npm run seed
```

### 3) Start frontend server
```bash
npm run dev
npm run seed
```

Frontend will run at:
👉 http://localhost:5173

## 🧪 API Endpoints (Backend)

### Users
- `GET /api/users` → Get all users
- `POST /api/users/create` → Create a user
- `POST /api/users/:targetId/follow` → Follow user
- `POST /api/users/:targetId/unfollow` → Unfollow user

### Posts
- `POST /api/posts/create` → Create post (text + image URL)
- `GET /api/posts/feed?userId=USER_ID&page=1&limit=5` → Feed pagination
- `POST /api/posts/:postId/like` → Like/Unlike post
- `POST /api/posts/:postId/comment` → Add comment

### Upload
- `POST /api/upload` → Upload image to Cloudinary

---

## 🔐 Notes
- `.env` is not pushed to GitHub for security reasons.
- Use `.env.example` to create your own `.env`.

---

## ✅ How to Run (Quick Commands)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👨‍💻 Author

Suru Prem Kumar
