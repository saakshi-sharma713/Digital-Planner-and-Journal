import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./Components/Home/Header";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import TextEditor from "./Components/Journal/TextEditor";
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

import ProtectedRoute from "./Pages/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<TextEditor />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/home" element={<Home />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/habit" element={<Habit />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/journals" element={<JournalList />} />
          <Route path="/journal/:id" element={<JournalDetail />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;