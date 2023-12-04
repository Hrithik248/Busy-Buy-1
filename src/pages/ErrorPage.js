import { useNavigate } from "react-router-dom"
//show this page in case of typing any invalid url
export default function ErrorPage(){
    const navigate=useNavigate();
    //navigate user back to home page in 3 sec
    setTimeout(()=>{
        navigate('/');
    },3000)
    return(
        <>
        <h2 style={{textAlign:'center'}} >404: Page Not Found :(</h2>
        <p style={{textAlign:'center'}} >Redirecting Back to Home Page...</p>
        </>
    )
}