import React, { useState } from 'react';
import GridLines from '../Components/GridLines';
import Doodle3 from '../Components/Doodles/Doodle3';
import Doodle1 from '../Components/Doodles/Doodle1';
import Doodle2 from '../Components/Doodles/Doodle2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();
const API = import.meta.env.VITE_URL;
    async function handleSubmit(e) {
        e.preventDefault(); // prevent default first
        try {
            // Call signup endpoint
            const result = await axios.post(`${API}/user/signup`, {
                name,
                email,
                password: pass
            });

            console.log(result.data);

            if (result.data.status) {
                // Save token & name to localStorage
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("name", result.data.name);

                navigate("/"); // redirect to home
            } else {
                alert(result.data.message || "Signup failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error signing up, please try again!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 relative overflow-hidden">
            <GridLines />
            <Doodle1 />
            <Doodle2 />
            <Doodle3 />

            <div className="relative p-10 w-[90%] sm:w-[400px] rounded-xl shadow-xl transform rotate-[-2deg] bg-[#FFD700] font-handwriting z-10">
                <h2 className="text-3xl font-bold mb-6 text-center font-caveat">
                    Sign Up
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 mb-4 rounded border border-gray-300 text-xl bg-yellow-50 font-handwriting"
                    />
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 mb-4 rounded border border-gray-300 text-xl bg-yellow-50 font-handwriting"
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="w-full p-4 mb-6 rounded border border-gray-300 text-xl bg-yellow-50 font-handwriting"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;