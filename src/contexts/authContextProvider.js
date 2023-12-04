// Importing necessary modules from React and Firebase
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { auth } from '../config/firebaseInit';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signOut 
} from "firebase/auth";

// Creating a context to manage authentication state
const authContext = createContext();

// Custom hook to access authentication context
export function useAuth() {
    return useContext(authContext);
}

// Authentication context provider component
export function AuthContextProvider({ children }) {
    // State to hold the current user and loading status
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    // useEffect to listen for changes in authentication state
    useEffect(() => {
        // Setting up an observer for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            // Updating user state and setting loading to false on authentication state change
            setUser(u);
            setLoading(false);
        });

        // Cleaning up the observer when the component unmounts
        return () => unsubscribe();
    }, []);

    // Function to handle user sign-in
    async function handleSignIn(email, password) {
        try {
            // Attempting to sign in with provided email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Signed In successfully !", {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    // Function to handle user sign-up
    async function handleSignUp(name, email, password) {
        try {
            // Attempting to create a new user with provided email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Updating user profile with provided display name
            await updateProfile(userCredential.user, { displayName: name });
            toast.success("Signed Up successfully !", {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    // Function to handle user sign-out
    async function handleSignOut() {
        try {
            // Attempting to sign out the current user
            await signOut(auth);
            toast.success("Signed out successfully !", {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (error) {
            console.log('unable to log out', error);
            toast.error("Something went wrong !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    // Providing authentication context value to the wrapped components
    return (
        <authContext.Provider value={{ user, isLoading, setLoading, handleSignIn, handleSignUp, handleSignOut }} >
            {children}
        </authContext.Provider>
    );
}
