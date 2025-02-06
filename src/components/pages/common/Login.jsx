import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUserAuthentication } from '../../../features/authenticationSlice';
import api from '../../../services/api';
import loginImage from './customerlogin.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const { email, password } = formData;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/login/', formData);
            const { access, refresh, user_id, email, first_name, last_name, is_admin } = data;
    
            localStorage.setItem('tokens', JSON.stringify(data));
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
    
            const userDetails = {
                user_id,
                email,
                first_name,
                last_name,
                isAuthenticated: true,
                is_admin,
            };
    
            dispatch(setUserAuthentication(userDetails));
    
            toast.success('Login successful! Redirecting...');
    
            if (is_admin) {
                navigate('/admin/home');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
            toast.error('Invalid login credentials');
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Left side image with adjusted sizing */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-8">
                <div className="relative w-full max-w-lg h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                        src={loginImage}
                        alt="Login background"
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                </div>
            </div>

            {/* Right side login form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:w-1/2">
                <div className="absolute top-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        Android App Download Portal
                    </h1>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl px-8 py-10 ring-1 ring-gray-200 dark:ring-gray-700">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-8">
                            Sign in
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        value={email}
                                        onChange={handleChange}
                                        autoComplete="email" 
                                        required 
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        value={password}
                                        onChange={handleChange}
                                        autoComplete="current-password" 
                                        required 
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600 dark:text-red-500">{error}</p>}

                            <div>
                                <button 
                                    type="submit" 
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;