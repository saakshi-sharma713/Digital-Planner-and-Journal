import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const UserContext = createContext();

const DataContext = ({ children }) => {
  const [moods, setMoods] = useState([]);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_URL;
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  // 🔥 Restore after refresh
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedToken = localStorage.getItem("token");

    if (savedName) setName(savedName);
    if (savedToken) setToken(savedToken);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const result = await axios.post(
        "http://localhost:8990/user/login",
        { email, password }
      );

      const userName = result.data.name;
      const userToken = result.data.token;

      localStorage.setItem("name", userName);
      localStorage.setItem("token", userToken);

      setName(userName);
      setToken(userToken);

      toast.success("Login Successful!");
      navigate("/home");

    } catch (error) {
      toast.error("Login failed!");
    }
  }

  return (
    <UserContext.Provider value={{ name, token, setName,BACKEND_URL,moods,setMoods }}>
      {children}
    </UserContext.Provider>
  );
};

export default DataContext;