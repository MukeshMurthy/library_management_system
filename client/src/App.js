import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import AddBook from "./pages/admin/AddBook/AddBook";
import BookDetails from "./pages/admin/BookDetails/BookDetails"; 
import Profile from "./components/common/Profile/Profile";
import UserList from "./pages/admin/Userlist/Userlist";
import BorrowHistory from "./pages/admin/BorrowHistory/BorrowHistory";
import ReturnedBooks from "./pages/admin/ReturnedBooks/ReturnedBooks";
import OverdueBooks from "./pages/admin/OverdueBooks/OverdueBooks";
import AvailableBooks from "./pages/user/AvailableBooks/AvailableBooks";
import ReturnBook from "./pages/user/ReturnBooks/ReturnBooks";
import UserBorrowHistory from "./pages/user/UserBorrowHistory/UserBorrowHistory";
import PrivateRoute from "./components/routes/PrivateRoute";
import UserDetails from "./pages/admin/UserDetails/UserDetail";
import AdminBorrowRequests from "./pages/admin/borrowrequest/borrowrequest";
import ScrollToTop from "./components/common/ScrollTop/ScrollTop"; 

function App() {
  return (
    <>
    
    <Router>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-book"
          element={
            <PrivateRoute roleRequired="admin">
              <AddBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/book/:id"
          element={
            <PrivateRoute roleRequired="admin">
              <BookDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute roleRequired="admin">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roleRequired="admin">
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <PrivateRoute roleRequired="admin">
              <UserDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <PrivateRoute roleRequired="admin">
              <BorrowHistory />
            </PrivateRoute>
          }
        />
         <Route
          path="/admin/requests"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminBorrowRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/returned"
          element={
            <PrivateRoute roleRequired="admin">
              <ReturnedBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/overdue"
          element={
            <PrivateRoute roleRequired="admin">
              <OverdueBooks />
            </PrivateRoute>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRoute roleRequired="user">
              <Navigate to="/user/available" />
            </PrivateRoute>
          }
        />
       
        <Route
          path="/user/profile"
          element={
            <PrivateRoute roleRequired="user">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/available"
          element={
            <PrivateRoute roleRequired="user">
              <AvailableBooks />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/return"
          element={
            <PrivateRoute roleRequired="user">
              <ReturnBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/history"
          element={
            <PrivateRoute roleRequired="user">
              <UserBorrowHistory />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
