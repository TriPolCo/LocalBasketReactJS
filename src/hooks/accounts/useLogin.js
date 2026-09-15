// src/hooks/useLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AccountService } from "../../api/services/accountService";
import useAuth from "./useAuth";

export default function useLogin() {
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const {
    mutate: executeLogin,
    isPending,
    error: apiError,
  } = useMutation({
    mutationFn: (credentials) => AccountService.login(credentials),
    onSuccess: (res) => {
      // Handles both cases: res.data (Axios intercepted) OR res.data.data (raw Axios)
      const dataPayload = res?.data?.tokens ? res.data : res?.data?.data ? res.data.data : res;

      const tokens = dataPayload?.tokens;
      const user = dataPayload?.user;

      if (!tokens?.access) {
        console.error("Token missing from login response:", res);
        return;
      }

      // 1. Store the session
      loginSession({ tokens, user });

      // 2. Navigate to dashboard
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      console.error("Login request failed:", err);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setValidationError("");

    if (formData.phone.length < 10) {
      setValidationError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!formData.password) {
      setValidationError("Password is required.");
      return;
    }

    executeLogin({
      phone_number: formData.phone,
      password: formData.password,
    });
  };

  return {
    formData,
    showPassword,
    isLoading: isPending,
    error: validationError || apiError?.detail || apiError?.message || "",
    handleChange,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    handleSubmit,
  };
}