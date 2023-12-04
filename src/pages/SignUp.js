import { useEffect, useState } from "react"
import { useAuth } from "../contexts/authContextProvider";
import style from '../styles/SignInSignUp.module.css';
import { useNavigate } from "react-router-dom";
export default function SignUp(){
    const navigate=useNavigate();
    //states for recording user sign up data
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    //importing sign up handler and user status from auth Context
    const {handleSignUp,user}=useAuth();
    //navigating user to home page if user is already logged in
    useEffect(()=>{
        if(user){
            navigate('/');
        }
    },[user])
    return(
        <form className={style.formCon} onSubmit={(e)=>{e.preventDefault();handleSignUp(name,email,password)}} >
            <input className={style.name} type="text" placeholder="Enter Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className={style.email} type="text" placeholder="Enter you Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className={style.password} type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button className={style.logInBtn} >Sign up</button>
        </form>
    )
}