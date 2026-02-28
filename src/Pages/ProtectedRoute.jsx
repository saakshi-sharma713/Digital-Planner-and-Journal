
import Home from "../Pages/Home"
import Login from './Login';
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem("token");

 if(!token){
    return <Navigate to="/"/>
 }
  return children;
  
}

export default ProtectedRoute
