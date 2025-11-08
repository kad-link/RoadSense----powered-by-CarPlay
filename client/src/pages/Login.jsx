import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/loginuser`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })
      console.log('Form submitted:', formData);

      const data = await response.json();

      if(response.ok && data.success){
        login(data.user ,data.token);
        alert(`LoggedIn successfully`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setFormData({
          email: "",
          password: ""
        })
        setTimeout(() => navigate("/"), 100);
      }
      else{
        alert(data.message || "Registration failed. Please try again")
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Internal Server Error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-gray-900">
      </div>

      <NavLink 
        to="/" 
        className="absolute top-4 right-4 z-20"
      >
        <Home size={32} color="white" />
      </NavLink>
        
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-2xl p-8">

            <div className="flex items-center justify-start mb-2">
              <h1 className="text-4xl font-bold text-gray-900">RoadSense</h1>
            </div>
            
            <p className="text-gray-600 text-lg mb-8">Login to your account</p>

            <div className="space-y-6">

              <div>
                <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                  Email Address
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
                  Password
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="" className="text-sm text-blue-900 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                
                className="w-full bg-blue-900 text-white font-semibold py-4 rounded-lg cursor-pointer hover:bg-black transition-colors duration-600 shadow-lg"
              >
                Login
              </button>
              

              <div className="text-center mt-4">
                <p className="text-gray-600 inline">
                  Don't have an account? 
                  <NavLink to="/register" className="text-blue-900 font-semibold hover:underline ml-1">
                  
                    Sign up
                  
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;