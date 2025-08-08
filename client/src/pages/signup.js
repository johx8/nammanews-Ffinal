import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
const SignUp = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
            console.log('signup successful', response.data)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', response.data.userId);
            if (response.data.success) {
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-20">
            <h1 className="text-2xl font-bold mb-4">Sign Up to create an account</h1>
            <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" name = "name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-500" />
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition duration-200">Sign Up</button>
            </form>
            <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
    );
};
export default SignUp;