import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import JournalPage from "./Pages/Journal";
import Home from "./Pages/Home";
import Calendar from "./Pages/Calendar";
import MoodTracker from "./Pages/MoodTracker";
import Habit from "./Pages/Habit";
import Goals from "./Pages/Goals";
import JournalList from "./Pages/JournalList";
import JournalDetail from "./Pages/JournalDetail";
import TodoPage from "./Pages/Todo";
import Dashboard from "./Pages/Dashboard";
import LayoutWithHeader from "./Components/LayoutHeader";
import ProtectedRoute from "./Pages/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />

  {/* Routes with Header */}
  <Route path="/home" element={<LayoutWithHeader><Home /></LayoutWithHeader>} />
  <Route path="/journal" element={<LayoutWithHeader><JournalPage /></LayoutWithHeader>} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
    <Route path="/calendar" element={<LayoutWithHeader><Calendar /></LayoutWithHeader>} />
    <Route path="/mood" element={<LayoutWithHeader><MoodTracker /></LayoutWithHeader>} />
    <Route path="/habit" element={<LayoutWithHeader><Habit /></LayoutWithHeader>} />
    <Route path="/goals" element={<LayoutWithHeader><Goals /></LayoutWithHeader>} />
    <Route path="/journals" element={<LayoutWithHeader><JournalList /></LayoutWithHeader>} />
    <Route path="/journal/:id" element={<LayoutWithHeader><JournalDetail /></LayoutWithHeader>} />
    <Route path="/todo" element={<LayoutWithHeader><TodoPage /></LayoutWithHeader>} />
    <Route path="/dashboard" element={<LayoutWithHeader><Dashboard /></LayoutWithHeader>} />
  </Route>
</Routes>
    </div>
  );
};

export default App;