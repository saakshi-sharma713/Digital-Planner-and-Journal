import React from 'react'
import Calendar from './Pages/Calendar'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { Routes,Route, UNSAFE_RemixErrorBoundary } from 'react-router-dom'
import TextEditor from './Components/Journal/TextEditor'
import JournalPage from './Pages/Journal'
import Home from './Pages/Home'
import ProtectedRoute from './Pages/ProtectedRoute'
import { Toaster } from 'react-hot-toast';
import MoodTracker from './Pages/MoodTracker'
import Habit from './Pages/Habit'
import Goals from "./Pages/Goals"
import JournalList from './Pages/JournalList'
import JournalDetail from './Pages/JournalDetail'
import TodoPage from './Pages/Todo'
import Dashboard from './Pages/Dashboard'
import Header from './Components/Home/Header'

const App = () => {
  return (
    <div>
        <Toaster position="top-right" reverseOrder={false} />
        <Header/>
      <Routes>
       
        <Route path="/" element={<Login/>}/> 
           <Route path="/signup" element={<SignUp/>}/>
           <Route path="/upload" element={<TextEditor/>}/>
           <Route path="/journal" element={<JournalPage/>}/>
           <Route path="/home" element={
            <Home/>}/>
            
            <Route path="/calendar" element={<Calendar/>}/>
            <Route path="/mood" element={<MoodTracker/>}/>
            <Route path="/habit" element={<Habit/>}/>
            <Route path="/goals" element={<Goals/>}/>
            <Route path="/journals" element={<JournalList/>}/>
            <Route path="/journal/:id" element={<JournalDetail/>}/>
            <Route path="/todo" element={<TodoPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
             
      </Routes>
    
    </div>
  )
}

export default App



