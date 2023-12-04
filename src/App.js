import './App.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import  OrdersPage  from './pages/OrdersPage';
import ErrorPage from './pages/ErrorPage';
import { AuthContextProvider } from './contexts/authContextProvider';
import { CartAndOrdersContextProvider} from './contexts/OrdersAndCartContext';
function App() {
  //cofiguring router
  const router=createBrowserRouter([
    {path:'/',
    element:<Navbar/>,
    errorElement:<ErrorPage/>,
    children:[
      {path:'/',element:<HomePage/>},
      {path:'sign_in',element:<SignIn/> },
      {path:'sign_up',element:<SignUp/>},
      {path:'cart',element:<CartPage/>},
      {path:'orders',element:<OrdersPage/>}
    ]
    }
  ]);
  return (
    <AuthContextProvider>
      <CartAndOrdersContextProvider>
        <ToastContainer/>
        <RouterProvider router={router} />
      </CartAndOrdersContextProvider>
    </AuthContextProvider>
  );
}

export default App;
