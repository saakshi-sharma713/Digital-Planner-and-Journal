import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../ContextApi/DataContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [login, setLogin] = useState(false);

  const { setName } = useContext(UserContext); 
  const navigate = useNavigate();
  const API = import.meta.env.VITE_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLogin(true);

    try {
      const result = await axios.post(`${API}/user/login`, {
        email,
        password,
      });

      const userName = result.data.name;
      const token = result.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("name", userName);

      setName(userName); // 🔥 THIS IS THE FIX

      toast.success("Login Successful!");
      navigate("/home");

    } catch (error) {
      toast.error("Login failed!");
    } finally {
      setLogin(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 relative overflow-hidden">
      <GridLines />
      <Doodle1 />
      <Doodle2 />
      <Doodle3 />

      <div className="relative p-10 w-[90%] sm:w-[400px] rounded-xl shadow-xl transform rotate-[-2deg] bg-[#FFD700] z-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 rounded border border-gray-300 text-xl bg-yellow-50"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            className="w-full p-4 mb-6 rounded border border-gray-300 text-xl bg-yellow-50"
            required
          />

          <button
            type="submit"
            disabled={login}
            className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {login ? "Logging in..." : "Login"}
          </button>
        </form>

        <h2 className="mt-5 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold">
            Signup
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default Login;