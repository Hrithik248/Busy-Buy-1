import { useEffect,useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCartAndOrders } from '../contexts/OrdersAndCartContext';
import style from '../styles/CartPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContextProvider';
export default function CartPage(){
    //getting user status from auth context
    const {user}=useAuth();
    const navigate=useNavigate();
    //navigating user back to homepage if user is not logged in
    useEffect(()=>{
        if(!user){
            navigate('/');
        }
    },[user])
    //getting cart and order handler from cart and orders context
    const {cart,handleRecordOrder}=useCartAndOrders();
    //total price
    const [totalPrice,setTotalPrice]=useState(0);
    useEffect(() => {
        // Calculate total price whenever cartItems change
        const newTotalPrice = cart.reduce((total, item) => total + item.qty*item.price, 0);
        setTotalPrice(newTotalPrice);
      }, [cart]); 
    return (
        cart.length===0?<h2>Your Cart is Empty !</h2>:
        <div className={style.cartPageCon} >
            <div className={style.purchaseCard} >
                <h3>Total Price:- &#x20B9; {totalPrice} /-</h3>
                {/*navigate user to orders page after placing order */}
                <button className={style.purchaseBtn} onClick={()=>{handleRecordOrder(cart,navigate)}} >Purchase</button>
            </div>
            <div className={style.cartCon} >
                <div className={style.cartList} >
                    {
                        cart.map((prod,ind)=><ProductCard product={prod} key={ind} />)
                    }
                </div>
            </div>
        </div>
    )
}