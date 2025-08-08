const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

const authRoute = require("./AdminModels/routes/authRoutes");
const profileRoutes = require("./AdminModels/routes/profileRoutes");
app.use(authRoute);
app.use("/profile", profileRoutes);

const bookRoutes = require("./AdminModels/books");
app.use("/api/books", bookRoutes);


const bookDetailsRoutes = require("./AdminModels/BookDetails");
app.use("/api/book-details", bookDetailsRoutes);
app.use("/api/borrowers", bookDetailsRoutes);


const adminBorrowRoutes = require("./AdminModels/routes/borrowRoutes");
app.use("/api/borrow", adminBorrowRoutes);


const returnedRoutes = require("./AdminModels/routes/returnedRoutes");
const overdueRoutes = require("./AdminModels/routes/overdueRoutes");
app.use("/api/returned", returnedRoutes);
app.use("/api/overdue", overdueRoutes);


const userRoutes = require("./AdminModels/userroutes");
app.use("/users", userRoutes);

const adminApprove = require("./AdminModels/Adminapprove");
app.use("/api/admin", adminApprove);


const userBorrowRoutes = require("./UserModels/bookBorrow");
app.use("/api/user-borrow", userBorrowRoutes);


const returnBooks = require("./UserModels/returnBooks");
app.use("/api/return", returnBooks);


const borrowHistory = require("./UserModels/borrowHistory");
app.use("/api/history", borrowHistory);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});