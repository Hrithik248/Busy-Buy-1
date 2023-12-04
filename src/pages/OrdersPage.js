import style from '../styles/OrdersPage.module.css';
import { useCartAndOrders } from '../contexts/OrdersAndCartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContextProvider';
import { useEffect } from 'react';
export default function OrdersPage(){
    //getting user status from auth context
    const {user}=useAuth();
    const navigate=useNavigate();
    //navigating user back to home page if user is not logged in
    useEffect(()=>{
        if(!user){
            navigate('/');
        }
    },[user])
    //getting order details from cart and orders context
    const {orders}=useCartAndOrders();
    return (
        orders.length===0?<h2>You have not ordered anything yet !</h2>:
        <div className={style.ordersCon} >
            <h2>Your Orders</h2>
            {orders.map((order,ind)=>(
                <div className={style.order} key={ind} >
                    <h3>Ordered On: {order.timestamp.toDate().getDate()}-{order.timestamp.toDate().getMonth()+1}-{order.timestamp.toDate().getFullYear()}</h3>
                    <table className={style.orderTable} >
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                order.data.map((item,ind)=>(
                                    <tr key={ind}>
                                        <td>{item.name}</td>
                                        <td>{item.price}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.price*item.qty}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td colSpan="3">Total</td>
                                <td>
                                {order.data.reduce((total, item) => total + item.price * item.qty, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}