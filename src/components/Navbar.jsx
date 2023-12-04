// Importing necessary modules and components
import { Outlet } from "react-router-dom";
import Spinner from 'react-spinner-material';
import style from '../styles/Navbar.module.css';
import spinnerStyle from '../styles/Spinner.module.css';
import { useAuth } from "../contexts/authContextProvider";
import { useNavigate, NavLink } from "react-router-dom";

// Functional component for rendering the navigation bar
export default function Navbar() {
    // Destructuring values from the authentication context
    const { user, handleSignOut, isLoading } = useAuth();

    // Accessing the navigation function from react-router-dom
    const navigate = useNavigate();

    return (
        <>
            {/* Conditional rendering of a spinner while authentication state is being loaded */}
            {isLoading ? (
                <Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} />
            ) : (
                <>
                    {/* Main navigation bar container */}
                    <div className={style.navBarCon}>
                        {/* Logo and brand name section */}
                        <div className={style.nameAndLogoCon}>
                            <img className={style.logo} src="https://i.pinimg.com/736x/e3/b7/ad/e3b7addfe30056ac70b4b5968ecdcca4.jpg" alt="Busy Buy Logo" />
                            <span className={style.name}>Busy Buy</span>
                        </div>

                        {/* Navigation icons section */}
                        <div className={style.navIconsCon}>
                            {/* Home button */}
                            <NavLink className={style.homeBtn} to='/'>
                                <img className={style.icon} src='https://cdn-icons-png.flaticon.com/128/609/609803.png' alt="Home Icon" />
                                <span className={style.btnText}>Home</span>
                            </NavLink>

                            {/* My Orders button, visible only when user is logged in */}
                            {user && (
                                <NavLink className={style.ordersBtn} to='/orders'>
                                    <img className={style.icon} src='https://cdn-icons-png.flaticon.com/128/1632/1632670.png' alt="Orders Icon" />
                                    <span className={style.btnText}>My Orders</span>
                                </NavLink>
                            )}

                            {/* Cart button, visible only when user is logged in */}
                            {user && (
                                <NavLink className={style.cartBtn} to='/cart'>
                                    <img className={style.icon} src='https://cdn-icons-png.flaticon.com/128/4290/4290854.png' alt="Cart Icon" />
                                    <span className={style.btnText}>Cart</span>
                                </NavLink>
                            )}

                            {/* Login/Logout button, toggles based on user authentication status */}
                            <div className={style.logInOutBtn} onClick={() => (user ? handleSignOut() : navigate('/sign_in'))}>
                                <img
                                    className={style.icon}
                                    src={user ? 'https://cdn-icons-png.flaticon.com/128/10152/10152161.png' : 'https://cdn-icons-png.flaticon.com/128/4034/4034219.png'}
                                    alt={user ? 'Logout Icon' : 'Login Icon'}
                                />
                                <span className={style.btnText}>{user ? 'Logout' : 'Log In'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rendering the nested routes */}
                    <Outlet />
                </>
            )}
        </>
    );
}
