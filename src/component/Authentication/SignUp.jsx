import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/Styles/authentication/signup.scss'
import Logo from '../../assets/Images/Logo/11.png'
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [location,setLocation] = useState('')
  const [phone_no,setPhone_no] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [confirmpassword,setConfirmpassword] = useState('')
  const [varify,setVarify] = useState(false)
  const [hidepop,setHidepop] = useState(false)
  const [hidemessage,setHidemessage] = useState(false)

  const hanldeMessage = () => {
    setHidemessage(!hidemessage)
  }
  const handlePop =() => {
    setHidepop(!hidepop)
  }
  const handleVarify = () => {
    setVarify(!varify)
  }

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
                <h1>Register to open account</h1>
                <p>Welcome to Hydevest lorem jsjkodvn aocnkcnol</p>
            </div>
        </div>
            <div className="registerChild col-lg-9 col-md-9 col-sm-9">
                <div className="registerChildTop">
                    <h1>Register</h1>
                    <p>Identity Infomation</p>
                </div>
                <form action="">
                  <div className="formtitle">
                    <p>PLease enter your valid identity information below.</p>
                    </div>
                    <div className="formInput">
                    <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>first name</h3>
                        <input type="name" 
                        placeholder='Enter First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}/>
                      </div>
                      <div className="rightWrapper">
                        <h3>last name</h3>
                        <input type="name" 
                        placeholder='Enter Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}/>
                      </div>
                    </div>
                      <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>email address</h3>
                        <input type="email" 
                        placeholder='Enter Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                      </div>
                      <div className="rightWrapper">
                        <h3>phone number</h3>
                        <input type="pnone_no" 
                        placeholder='Enter Phone Number'
                        value={phone_no}
                        onChange={(e) => setPhone_no(e.target.value)}/>
                      </div>
                    </div>
                      <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>location</h3>
                        <input type="location" 
                        placeholder='Enter or use Location icon'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}/>
                      </div>
                      <div className="rightWrapper">
                        <h3>display name </h3>
                        <input type="name" 
                        placeholder='Enter Display Name'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
                      </div>
                    </div>
                      <div className="fillWrapper">
                      <div className="leftwrapper">
                        <h3>password</h3>
                        <input type="password" 
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                      </div>
                      <div className="rightWrapper">
                        <h3>confirm password</h3>
                        <input type="password" 
                        placeholder='Confirm Password'
                        value={confirmpassword}
                        onChange={(e) => setConfirmpassword(e.target.value)}/>
                      </div>
                      </div>
                    </div>
                    <div className="robotHoman">
                      <div className="iconvarify">
                        <div className={varify ? 'd-none' : "clickIcons"} onClick={handleVarify}></div>
                        <div className={varify ? "unClickIcons" : "d-none"} onClick={handleVarify}> <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.5725 0.570312L4.28683 6.85603L1.42969 3.99888" stroke="#999999" stroke-linecap="round" stroke-linejoin="round"/> </svg>  </div>
                      </div>
                      <p> varify that you are not a Robot.</p>
                    </div>
                    <button onClick={handlePop}>Register</button>
                </form>
            </div>
        </div>
      </div>
      <div className={hidepop ? "registerpop" : "d-none"}>
        <div className="popmessageContainer">
      <div className={hidemessage ? "d-none " : 'popmessage'}>
        <h1>Registered Successfully</h1>
        <p>You have successfully registered . Please check your email to confirm your account</p>
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
    </div>
  )
}
export default SignUp
