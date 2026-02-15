import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/Styles/authentication/signup.scss'
import Logo from '../../assets/Images/Logo/11.png'
import { Link } from 'react-router-dom';
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import ResetPasswordModal from './ResetPasswordModal';

const SignUp = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [varify,setVarify] = useState(false)
  const [hidepop,setHidepop] = useState(false)
  const [hidemessage,setHidemessage] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const hanldeMessage = () => {
    setHidemessage(!hidemessage)
  }
  const handlePop =() => {
    setHidepop(!hidepop)
  }
  const handleVarify = () => {
    setVarify(!varify)
  }
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
  
    try {
      setLoading(true);
      setError("");
  
      const payload = new URLSearchParams();
      payload.append("email", email.trim());
      payload.append("password", password);
  
      const res = await api.post("/auth/login", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
  
        // ✅ show success popup first
        setShowSuccessPopup(true);
  
        // setTimeout(() => {
        //   navigate("/dashboard/trip", { replace: true });
        // }, 1800);
        
        if(res.data.is_system_user === 1){
          navigate("/dashboard/trip", { replace: true })
        }
        // if(res.data.account_type === "PARTNER"){
        //   navigate("")
        // }
      } else {
        setError(res.data.message || "Invalid email or password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  const showForgotPassword =
  error &&
  error.toLowerCase().includes("email") &&
  error.toLowerCase().includes("password");


  return (
    <div className='register'>
        <div className="overflow"></div>
      <div className="registerContainer">
        <div className="registerParent row">
        <div className="registerSidebar col-lg-3 col-md-3 col-sm-3">
            <div className="registerSidebarLogo">
            <img src={Logo} alt="Hydevest Logo" />
            <h1>Hydevest</h1>
            </div>
            <div className="registerSidebartext">
                <h1>Login to open account</h1>
                <p>Welcome to Hydevest lorem jsjkodvn aocnkcnol</p>
            </div>
        </div>
            <div className="registerChild col-lg-9 col-md-9 col-sm-9">
                <div className="registerChildTop">
                    <h1>Login</h1>
                    <p>Identity Infomation</p>
                
                </div>
                <form onSubmit={handleLogin}>
                  <div className="formtitle">
                    <p>PLease enter your valid identity information below.</p>
                    </div>
                    <div className="formInput">
                      <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>email address</h3>
                        <input type="email"
                        placeholder='Enter Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                      </div>

                    </div>
                    
                      <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>password</h3>
                        <input type="password" 
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>

{showForgotPassword && (
  <p
    className="forgot-password mt-4" style={{cursor:"pointer"}}
    onClick={() => setShowResetModal(true)}
  >
    Forgot password?
  </p>
)}
    {error && <p style={{ color: "red",margin:"0" }}>{error}</p>}
                      </div>

                      </div>
                    </div>
                    {/* <div className="robotHoman">
                      <div className="iconvarify">
                        <div style={{
                          border:"1px solid #000"
                        }} className={varify ? 'd-none' : "clickIcons"} onClick={handleVarify}></div>
                        <div className={varify ? "unClickIcons" : "d-none"} onClick={handleVarify}> <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.5725 0.570312L4.28683 6.85603L1.42969 3.99888" stroke="#999999" stroke-linecap="round" stroke-linejoin="round"/> </svg>  </div>
                      </div>
                      <p> varify that you are not a Robot.</p>
                    </div> */}
                    

                    <button type="submit" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                      </button>

                </form>
            </div>
        </div>
      </div>
      <div className={hidepop ? "registerpop" : "d-none"}>
        <div className="popmessageContainer">
      <div className={hidemessage ? "d-none " : 'popmessage'}>
        <h1>Login Successfully</h1>
        <p>You have successfully Login . Please check your email to confirm your account</p>
        <div className="popwrapper">
        <Link className='leftboton Link' onClick={hanldeMessage}>Goto Email</Link>
        </div>
      </div>
      <div  className={hidemessage ? " popmessage" : 'd-none'}>
        <h1>Email Account Confirmed</h1>
        <p>Your email account has been confirmed successfully Please click the button below to login to your account</p>
        <div className="popwrapper">
        <Link   to="/elevatedLogin" className='leftboton Link' >Login</Link>
        </div>
      </div>
      </div>
      </div>
      <div className="resetPasswordModel">     
       {showResetModal && ( <ResetPasswordModal
    onClose={() => setShowResetModal(false)}/>)}
    </div>
    {showSuccessPopup && (
  <div className="resetPasswordModel">
    <div className="popup-card">
      <h2>Login Successful 🎉</h2>
      <p>Redirecting to your dashboard...</p>
    </div>
  </div>
)}



    </div>
  )
}
export default SignUp
 