import { Link, useNavigate } from 'react-router-dom';
import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {   
      const navigate = useNavigate();
      const [formData, setFormData] = useState({
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
              const response = await axios.post('http://localhost:5000/api/auth/login', formData);
              console.log('login successful', response.data)
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', response.data.userId);
              localStorage.setItem('name', response.data.name);
              localStorage.setItem('email', response.data.email);
              localStorage.setItem('role', response.data.role);
              console.log('User logged in:', response.data);
              navigate('/'); 
              window.location.reload();// Redirect to home page after successful login
          } catch (error) {
              console.error('Error during login:', error);
              alert('An error occurred. Please try again.');
          }
      };

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-20" >
      <h1 className="text-3xl font-bold mb-10">Login to your account</h1>
      <form className="bg-white p-5 rounded shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name= "email" value={formData.email} onChange={handleChange} id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" required />
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700 transition duration-200">Login</button>
      </form>
       <p className="mt-4 text-sm">Do not have an account? <Link to="/signup" className="text-blue-600 hover:underline">SignUp</Link></p>
    </div>
  );
}

export default Login;