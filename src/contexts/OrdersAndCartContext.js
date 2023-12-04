import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {db} from '../config/firebaseInit';
import { useAuth } from "./authContextProvider";
import { collection, onSnapshot, doc, updateDoc, increment, setDoc, deleteDoc, addDoc, serverTimestamp, query, orderBy , getDocs} from "firebase/firestore";
//declaring cart and orders context
const cartAndOrdersContext=createContext();
//custom hook for using context
export function useCartAndOrders(){
    return useContext(cartAndOrdersContext);
}
//context provider
export function CartAndOrdersContextProvider({children}){
    //list of items in cart
    const [cart,setCart]=useState([]);
    //orders placed by the user
    const [orders,setOrders]=useState([]);
    //getting user status from auth context
    const {user}=useAuth();
    //setting event hanlder for listening changes in cart and initialing cart
    useEffect(()=>{
        let unsub;
        const initializeCart =  () => {
            const allCartsRef = collection(db, 'usersCarts');
            const currentUserRef = doc(allCartsRef, user.uid);
            const cartRef = collection(currentUserRef, 'myCart');
            // listen for changes
            unsub = onSnapshot(cartRef, (querySnapshot) => {
                const cartData = [];
                querySnapshot.forEach((doc) => {
                    cartData.push(doc.data());
                });
                setCart(cartData);
            });
        };
        //initialize and add event listner only if user is logged in
        if(user){
            initializeCart();
        }
        else{
            //else set the cart empty if user logs out
            setCart([]);
        }
        if(unsub){
            return unsub;
        }
        },[user]);  
    //setting event hanlder for listening changes in orders list and initialing orders  list  
    useEffect(()=>{
        //set listner only if user is logged in
        if(user){
            const userOrdersRef=collection(db,'userOrders');
            const currentUserRef=doc(userOrdersRef,user.uid);
            const ordersRef=collection(currentUserRef,'orders');
            const q=query(ordersRef,orderBy('timestamp','desc'));
            const unsub=onSnapshot(q,(querySnapshot)=>{
                const ordersData=[];
                querySnapshot.forEach((order)=>{
                    ordersData.push(order.data());
                });
                setOrders(ordersData);
            })
            return unsub
        }
        else{
            //else set the orders list empty
            setOrders([]);
        }
    },[user]);
    //handles adding of item in cart    
    async function handleAddToCart(itemToAdd){
        try {
            const allCartsRef = collection(db, 'usersCarts');
            const currentUserRef = doc(allCartsRef, user.uid);
            const cartRef = collection(currentUserRef, 'myCart');
            const itemInCart=cart.find((item)=>itemToAdd.id===item.id);
            //if item is already in cart increase the quantity by 1
            if(itemInCart){
                const itemRef=doc(cartRef,itemToAdd.id);
                await updateDoc(itemRef,{
                    qty:increment(1)
                })
            }
            else{
                //else add the item wiht qty 1
                const itemRef=doc(cartRef,itemToAdd.id);
                await setDoc(itemRef,{...itemToAdd,qty:1});
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    //handles removing of items from cart
    async function handleRemoveFromCart(itemId){
        try {
            const allCartsRef = collection(db, 'usersCarts');
            const currentUserRef = doc(allCartsRef, user.uid);
            const cartRef = collection(currentUserRef, 'myCart');
            const itemInCart=cart.find((item)=>itemId===item.id);
            //if item has only 1 qty remove it from the cart
            if(itemInCart.qty===1){
                await deleteDoc(doc(cartRef,itemId));
            }
            else{
                //if item has qty greater than 1 decrease its qty
                const itemRef=doc(cartRef,itemId);
                await updateDoc(itemRef,{
                    qty:increment(-1)
                })
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    //hanldes placing of order
    async function handleRecordOrder(order,navigate){
        try {
            //places the order and puts order details in orders list
            const userOrdersRef=collection(db,'userOrders');
            const currentUserOrdersRef=doc(userOrdersRef,user.uid);
            const ordersRef=collection(currentUserOrdersRef,'orders');
            const timestamp=serverTimestamp();
            await addDoc(ordersRef,{data:order,timestamp});
            //navigate user to orders page after delay so the orders changes listner can implement changes and set orders state accordingly
            setTimeout(()=>navigate('/orders'),100);
            //clearing the cart
            const allCartsRef = collection(db, 'usersCarts');
            const currentUserCartRef = doc(allCartsRef, user.uid);
            const cartItemsRef =collection(currentUserCartRef,'myCart');
            const cartItems=await getDocs(cartItemsRef);
            console.log(cartItems.docs);
            for (const item of cartItems.docs) {
                await deleteDoc(doc(cartItemsRef,item.id))
            }
            toast.success("Order placed successfully !", {
                position: toast.POSITION.TOP_CENTER
              });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
    return (
        <cartAndOrdersContext.Provider value={{cart,orders,handleAddToCart,handleRemoveFromCart,handleRecordOrder}} >
            {children}
        </cartAndOrdersContext.Provider>
    )
}