import React, { useState } from 'react'
import GridLines from '../Components/GridLines';
import Doodle1 from '../Components/Doodles/Doodle1';
import Doodle2 from '../Components/Doodles/Doodle2';
import Doodle3 from '../Components/Doodles/Doodle3';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [login,setlogin]= useState(false)
  const navigate = useNavigate()
 async function handleSubmit(e){
    e.preventDefault();
    setlogin(true)
    try{
  
   const result = await axios.post("http://localhost:8990/user/login",{email,password});
       await new Promise((resolve) => setTimeout(resolve, 1200));
   console.log(`Response from backend :`,result.data)
   localStorage.setItem("token",result.data.token)
    localStorage.setItem("name", result.data.name);
   toast.success("Login Sucessfull!")
   navigate("/home")
    console.log(email,password);
 }
 catch (error) {
    console.error("Login error:", error.response?.data || error.message);
  }
 }
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 relative overflow-hidden">
      
      {/* Grid background */}
      <GridLines/>

      {/* Doodle emoji background layer 1 */}
     {/* Doodle emoji background layer */}
    
<Doodle1/>

{/* Doodle emoji background layer 2 */}
<Doodle2/>

     {/* Doodle emoji background layer 2 */}
 <Doodle3/>

      {/* Sticky note login box */}
      <div className="relative md:top-[0] p-10 w-[90%] sm:w-[400px] rounded-xl shadow-xl transform rotate-[-2deg] bg-[#FFD700] font-handwriting z-10">
        <h2
          className="text-3xl font-bold mb-6 text-center font-caveat"
          style={{ fontFamily: 'Patrick Hand, cursive' }}
        >
          Login
        </h2>
         <form onSubmit={(e)=>{handleSubmit(e)}}>
        <input
          type="email"
          placeholder="Enter Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 rounded border border-gray-300 text-xl bg-yellow-50 font-handwriting"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          className="w-full p-4 mb-6 rounded border border-gray-300 text-xl bg-yellow-50 font-handwriting"
        />

        <button
          className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900"
          style={{ fontFamily: 'Patrick Hand, cursive' }}
          
        >
          {login ? "Logging in..." : "Login"}
        </button>
        </form>
        <h2 className='mt-5'>Already have an account ? <Link to="/signup" >Signup</Link></h2>
      </div>
     

    </div>
  );
};

export default Login;