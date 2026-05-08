# 💸 Expense Tracker — Full Stack MERN App

A full-stack **Expense & Income Tracker** built with the MERN stack (MongoDB, Express, React, Node.js). Features JWT authentication, interactive charts, CSV export, and emoji-tagged transactions.

---

## 🗂️ Project Structure

```
expense-tracker/
├── backend/                  # Express + Node.js API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env.example          # ← copy this to .env and fill in your values
│   └── vercel.json
│
└── frontend/
    └── expense-tracker/      # React + Vite app
        ├── src/
        ├── .env.example      # ← copy this to .env and fill in your values
        └── vercel.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/mrk-007/expense-tracker.git
cd expense-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `backend/.env` and update:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

| Variable       | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `PORT`         | Port the backend runs on (default: `5000`)                                  |
| `MONGO_URI`    | Your MongoDB Atlas connection string                                        |
| `JWT_SECRET`   | A long, random secret string used to sign JWT tokens                       |
| `JWT_EXPIRES_IN` | How long JWT tokens stay valid (e.g. `7d`, `24h`)                       |
| `FRONTEND_URL` | URL of your frontend (for CORS). Use `http://localhost:5173` locally       |

> 💡 **How to get your `MONGO_URI`:**
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Go to your Cluster → **Connect** → **Drivers**
> 3. Copy the connection string and replace `<username>`, `<password>`, and `<dbname>`

#### Start the Backend

```bash
npm run dev        # development (with auto-reload via nodemon)
# or
npm start          # production
```

Backend will run at: **http://localhost:5000**

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend/expense-tracker
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Open `frontend/expense-tracker/.env` and update:

```env
VITE_API_URL=http://localhost:5000
```

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `VITE_API_URL` | URL of your running backend API                  |

#### Start the Frontend

```bash
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## ✅ Running Both Together

Open **two terminals** side by side:

| Terminal 1 — Backend          | Terminal 2 — Frontend                          |
|-------------------------------|------------------------------------------------|
| `cd backend`                  | `cd frontend/expense-tracker`                  |
| `npm run dev`                 | `npm run dev`                                  |
| Runs on `localhost:5000`      | Runs on `localhost:5173`                       |

Then open your browser at **http://localhost:5173** 🎉

---

## 🌐 Deployment

### Backend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import `backend/`
3. Set **Root Directory** to `backend`
4. Add these **Environment Variables** in Vercel dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `FRONTEND_URL` ← set to your deployed frontend URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import `frontend/expense-tracker/`
2. Set **Root Directory** to `frontend/expense-tracker`
3. Add this **Environment Variable**:
   - `VITE_API_URL` ← set to your deployed backend URL

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Recharts  |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB Atlas + Mongoose                |
| Auth      | JWT (JSON Web Tokens) + bcryptjs        |
| Hosting   | Vercel (frontend + backend)             |

---

## 📬 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login & get token  |
| GET    | `/api/auth/profile`  | Get user profile   |

### Transactions
| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/api/transactions`             | Get all transactions         |
| POST   | `/api/transactions`             | Add new transaction          |
| DELETE | `/api/transactions/:id`         | Delete a transaction         |
| GET    | `/api/transactions/export/csv`  | Export transactions as CSV   |

---

## 📄 License

MIT © [mrk-007](https://github.com/mrk-007)
