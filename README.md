# library_management_system
# 📚 Library Management System

A full-stack Library Management System built with **React.js**, **Node.js (Express)**, and **PostgreSQL** that allows users to borrow and return books, while admins manage inventory and user activity.

---

## 🚀 Features

### 👤 User Features:
- User registration and login.
- Browse available books.
- Request to borrow books.
- View current borrowed books.
- Return borrowed books.
- Track personal borrow/return history.

### 🛠️ Admin Features:
- Admin login and authentication.
- View and manage all users.
- Approve or reject user borrow requests.
- Add, archive, unarchive, or delete books.
- Monitor stock and borrowing activity.

---

## 🏗️ Tech Stack

| Frontend        | Backend             | Database   |
|----------------|---------------------|------------|
| React.js        | Node.js + Express.js | PostgreSQL |

---

## 📁 Project Structure

```
/client         → React frontend
/server         → Express backend
/server/routes  → All API route handlers
/server/db      → PostgreSQL connection config
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/MukeshMurthy/E_commerce_organic_eats.git
cd E_commerce_organic_eats
```

### 2. Install Dependencies

#### For frontend:
```bash
cd client
npm install
```

#### For backend:
```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `/server` directory:
```
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start the Development Servers

- Run backend:
  ```bash
  npm start
  ```

- Run frontend:
  ```bash
  cd ../client
  npm start
  ```

---

## 📦 Database Schema (PostgreSQL)

- `users` – Stores user/admin info
- `books` – Stores book details
- `borrow_requests` – Stores borrow requests and approval status
- `borrow_history` – Tracks borrow and return actions

---

## 🛣️ API Routes Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/signup` | POST | Register new user |
| `/api/users/login`  | POST | User login |
| `/api/books` | GET | Get all available books |
| `/api/borrow/request` | POST | Request a book |
| `/api/return/:bookId` | PATCH | Return a borrowed book |
| `/api/history/:userId` | GET | Get user borrow history |
| `/api/admin/approve` | POST | Admin approves borrow request |

---

## 🔐 Authentication

- JWT-based authentication for users and admins.
- Separate access controls for user/admin dashboards.

---

## 🧠 Future Enhancements

- Email notifications for due dates and approvals.
- return approval request
- Book rating and review system.
- Search and filter functionality.
- Pagination and sorting enhancements.
- Dockerization for deployment.

---

## 📌 Author

**Mukesh Murthy**

GitHub: [@MukeshMurthy](https://github.com/MukeshMurthy)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).


