import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.init";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  verifyBeforeUpdateEmail,
  updatePassword,
  updateProfile,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Update profile
  const updateUserProfile = (profileInfo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profileInfo);
  };

  // Update password
  const updateUserPassword = (newPassword) => {
    setLoading(true);
    return updatePassword(auth.currentUser, newPassword);
  };

  // Update email
  const updateUserEmail = (newEmail) => {
    setLoading(true);
    return verifyBeforeUpdateEmail(auth.currentUser, newEmail);
  };

  // Forgot password → calls your backend
  const forgotPassword = async (email) => {
    return axios.post("http://localhost:3000/forgot-password", { email });
  };

  // Verify password reset code
  const verifyResetCode = (oobCode) => {
    return verifyPasswordResetCode(auth, oobCode);
  };

  // Confirm password reset
  const confirmResetPassword = (oobCode, newPassword) => {
    return confirmPasswordReset(auth, oobCode, newPassword);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // Delete user
  const deleteUserInfo = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return deleteUser(auth.currentUser);
  };

  // Firebase auth state listener
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      console.log("user status changed:", currentUser);

      if (currentUser?.email) {
        try {
          const res = await axios.post("http://localhost:3000/jwt", {
            email: currentUser.email,
          });

          localStorage.setItem("access-token", res.data.token);
        } catch (error) {
          console.error("JWT error:", error);
          localStorage.removeItem("access-token");
        }
      } else {
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,

    // Authentication
    createUser,
    signIn,
    logOut,

    // User management
    updateUserProfile,
    updateUserPassword,
    updateUserEmail,
    deleteUserInfo,

    // Forgot / Reset password
    forgotPassword,
    verifyResetCode,
    confirmResetPassword,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
