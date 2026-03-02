import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext();

const DataContext = ({ children }) => {
  const [moods, setMoods] = useState([]);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
    const [loadingMoods, setLoadingMoods] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_URL;

   async function fetchMoods() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${BACKEND_URL}/mood`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch (err) {
      console.error("Error fetching moods:", err);
    } finally {
      setLoadingMoods(false);
    }
  }

  // 🔥 Restore user after refresh
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedToken = localStorage.getItem("token");
      fetchMoods();
    if (savedName) setName(savedName);
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <UserContext.Provider
      value={{
        name,
        setName,
        token,
        setToken,
        BACKEND_URL,
        moods,
        setMoods,
         fetchMoods,
        loadingMoods,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default DataContext;