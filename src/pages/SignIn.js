import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContextProvider";
import style from '../styles/SignInSignUp.module.css';
import { Link, useNavigate } from "react-router-dom";
export default function SignIn(){
    const navigate=useNavigate();
    //states for recording user sign in details
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    //getting sign in hanlder and user status from auth Context
    const {handleSignIn,user}=useAuth();
    //navigating user back to home page if user if already logged in
    useEffect(()=>{
        if(user){
            navigate('/');
        }
    },[user])
    return(
        <form className={style.formCon} onSubmit={(e)=>{e.preventDefault();handleSignIn(email,password)}} >
            <h2>Sign In</h2>
            <input className={style.email} type="email" placeholder="Enter you Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className={style.password} type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className={style.logInBtn} >Log In</button>
            <span>Dont have an account yet ? </span><Link to='/sign_up' >Sign up</Link>
        </form>
    )
}