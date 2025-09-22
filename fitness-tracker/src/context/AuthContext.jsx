 // src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path if needed

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener is the core of Firebase Auth. It updates whenever the user logs in or out.
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; // Cleanup the listener when the component unmounts
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = { currentUser, logout };

  // We don't render the app until we know if a user is logged in or not
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the context
export function useAuth() {
  return useContext(AuthContext);
}