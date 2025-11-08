import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

 import { initializeApp } from "firebase/app";
 import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      
       const result = await signInWithPopup(auth, googleProvider);
       const user = result.user;
       const idToken = await result.user.getIdToken();
      
     
       const response = await fetch("http://localhost:3000/Glogin", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           token: idToken
         })
       });
      
       const data = await response.json();
      
       if (response.ok && data.success) {
         login(data.user, data.token);
         navigate("/");
       } else {
         alert(data.message || "Google sign-in failed");
       }
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match :/');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/registeruser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          carModel: formData.carModel
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('SignedUp successfully');
        login(data.user, data.token);
        setFormData({
          fullName: '',
          email: '',
          carModel: '',
          password: '',
          confirmPassword: ''
        });
        navigate("/");
      } else {
        alert(data.message || "Registration failed. Please try again");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Internal Server Error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gray-900"></div>

      <NavLink to="/" className="absolute top-4 right-4 z-20">
        <Home size={32} color="white" />
      </NavLink>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-start mb-2">
              <h1 className="text-4xl font-bold text-gray-900">RoadSense</h1>
            </div>
            
            <p className="text-gray-600 text-lg mb-8">Create your account to get started</p>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              type="button"
              className="w-full bg-white border-2 border-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Traditional Registration Form */}
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-gray-900 font-medium mb-2">
                  Full Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                  Email Address
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:outline-none"
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
                  Password
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-900 font-medium mb-2">
                  Confirm Password
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                type="button"
                className="w-full bg-blue-900 text-white font-semibold py-4 rounded-lg cursor-pointer hover:bg-black transition-colors duration-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;