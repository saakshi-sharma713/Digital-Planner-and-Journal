import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

const DataContext = ({ children }) => {
  const [moods, setMoods] = useState([]);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const BACKEND_URL = import.meta.env.VITE_URL;

  // 🔥 Restore user after refresh
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedToken = localStorage.getItem("token");

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default DataContext;