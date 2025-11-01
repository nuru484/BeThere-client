// src/hooks/useAuth.jsx
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log("login success.");
    },
    // onError: (error) => {
    //   console.error("Login failed:", error);
    // },
  });

  return mutation;
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();

  const logout = () => {
    contextLogout();
    navigate("/login");
  };

  return logout;
};
