import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.init";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in existing user
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update user profile (name, photo, etc.)
  const updateUserProfile = (profileInfo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profileInfo);
  };

  // update user passwrod
  const updateUserPassword = (newPassword) => {
    setLoading(true);
    return updatePassword(auth.currentUser, newPassword);
  };

  // inside AuthProvider
  const updateUserEmail = (newEmail) => {
    setLoading(true);
    return updateEmail(auth.currentUser, newEmail);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const deleteUserInfo = () => {
    setLoading(true);
    return deleteUser(auth.currentUser);
  };

  // Observe auth state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("user status changed ", currentUser);
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserPassword,
    updateUserEmail,
    updateUserProfile,
    deleteUserInfo,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
