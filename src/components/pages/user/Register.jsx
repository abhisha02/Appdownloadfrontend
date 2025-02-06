import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from '../../../services/api';
import loginImage from './registercustomer.avif'; // Make sure to import the same image

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { email, first_name, last_name, password, password2 } = formData;

  const validateForm = () => {
    const newErrors = {};
    
    if (password !== password2) {
      newErrors.password2 = "Passwords do not match";
    }
    
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (!email.includes('@')) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const submitData = {
        email: email.trim().toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        password: password,
        password2: password2,
      };

      const { data } = await api.post('/api/register/', submitData);
      
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response) {
        const serverErrors = err.response.data;
        
        if (typeof serverErrors === 'string') {
          toast.error(serverErrors);
          setErrors({ detail: serverErrors });
        } else if (typeof serverErrors === 'object') {
          setErrors(serverErrors);
          Object.entries(serverErrors).forEach(([key, value]) => {
            const errorMessage = Array.isArray(value) ? value[0] : value;
            toast.error(`${key}: ${errorMessage}`);
          });
        }
      } else if (err.request) {
        toast.error("Unable to connect to the server. Please try again.");
        setErrors({ detail: "Network error: Unable to connect to the server" });
      } else {
        toast.error("An unexpected error occurred");
        setErrors({ detail: "An unexpected error occurred" });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8">
        <div className="relative w-full max-w-lg h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={loginImage}
            alt="Register background"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        </div>
      </div>

      {/* Right side register form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:w-1/2">
        <div className="absolute top-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Android App Download Portal
          </h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl px-8 py-10 ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={first_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                />
                {errors.first_name && (
                  <p className="mt-1 text-red-500 text-sm">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                />
                {errors.last_name && (
                  <p className="mt-1 text-red-500 text-sm">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  value={password2}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className={`appearance-none block w-full px-3 py-2.5 border ${
                    errors.password2 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                />
                {errors.password2 && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password2}</p>
                )}
              </div>

              {errors.detail && (
                <p className="text-red-500 text-sm text-center">{errors.detail}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Create account
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;