import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginEmployee } from "../state/auth/authAction";

const useAuth = () => {

    const dispatch = useDispatch();

  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      staySignedIn: false
    }
  });

  const password = watch("password", "");

  const onLoginSubmit = async (data) => {
    try {
      console.log("Login Data:", data);

      dispatch(loginEmployee(data));

    } catch (error) {
      console.error(error);
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      console.log("Register Data:", data);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSubmitted(true);

      // reset();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    errors,
    isSubmitting,
    mounted,
    showPassword,
    setShowPassword,
    password,
    submitted,
    setSubmitted,
    onLoginSubmit,
    onRegisterSubmit,
    reset,
  };
};

export default useAuth;