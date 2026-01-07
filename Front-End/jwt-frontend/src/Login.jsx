import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault()
    
    if(validation()){
      axios
        .post("http://localhost:3000/user/login", {email: email, password: password})
        .then((response)=>{
          localStorage.setItem("jwt_token", response.data.token)
          navigate("/products");
        })
        .catch((error)=>{
          console.log(error)
        })       
    }else{
      return
    }
  }

  const validation = () => {
    if(password == "" || email == ""){
      setError("Please Enter Field")
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
      }, 5000);
      return false

    }else {
      return true
    }
  }

  return (
    <div className="login-container">
      <p style={{display: showError ? "block" : "none"}} className="error-message">
        {error}
      </p>
      <form className="login-box">
        <h2>Sign In</h2>

        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="login-input"
          required
        />

        <input
          value={password}
          onChange={(e)=>setPassword(e.target.value)}  
          type="password"
          placeholder="Password"
          className="login-input"
        />

        <button onClick={handleLogin} type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;