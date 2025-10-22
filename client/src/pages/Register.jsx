import React, { useState } from 'react';
import { NavLink, redirect } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Register() {

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    carModel: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });


  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match :/');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/registeruser", {
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          carModel: formData.carModel
        })
      })
      console.log('Form submitted:', formData);

      const data = await response.json();

      if(response.ok && data.success){
        alert(`SignedUp successfully`);
        login(data.user ,data.token);
        setFormData({
          fullName: '',
          email: '',
          carModel: '',
          password: '',
          confirmPassword: ''
        })

        navigate("/");
      }
      else{
        alert(data.message || "Registration failed. Please try again")
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Internal Server Error. Please try again later.');
    }
    finally{
      setLoading(false);
    }
    
    
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0  bg-gray-900">
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
            
            <p className="text-gray-600 text-lg mb-8">Create your account to get started</p>

            <div className="space-y-6">

              <div>
                <label htmlFor="fullName" className="block text-gray-900 font-medium mb-2">
                  Full Name
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black"
                  required
                />
              </div>

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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg  "
                  required
                />
              </div>

              <div>
                <label htmlFor="carModel" className="block text-gray-900 font-medium mb-2">
                  Car Name/Model
                </label>
                <input
                  type="text"
                  id="carModel"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="Tata Nano"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg "
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg "
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-900 font-medium mb-2">
                  Confirm Password
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg "
                  required
                />
              </div>

              <button
                className="w-full bg-blue-900 text-white font-semibold py-4 rounded-lg cursor-pointer hover:bg-black  transition-colors duration-600 shadow-lg"
              >
                Create Account
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;


