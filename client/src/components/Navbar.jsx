import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <>
      <div className="navbar fixed top-0 left-0 w-full h-[15vh] bg-gray-900/90 border-b-2 border-gray-700 z-50">
        <div className="flex items-center justify-between px-9 h-full">
          
          <div className="title font-bold text-4xl sm:text-5xl md:text-6xl tracking-tighter text-white">
            ROADSENSE
          </div>

          <div className="text-white font-bold text-lg sm:text-xl flex flex-row gap-10 sm:gap-20">
            <a
              href="#services"
              className="relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Services
            </a>
            <NavLink
              to="/about"
              className="relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </NavLink>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-row gap-6">
              <NavLink to="/register">
                <button className="bg-white text-black px-3 py-1 rounded-sm font-black cursor-pointer hover:bg-black hover:text-white transition-colors duration-300 ease-in-out">
                  REGISTER
                </button>
              </NavLink>
              <NavLink to="/login">
                <button className="bg-black text-white px-3 py-1 rounded-sm font-black cursor-pointer hover:bg-white hover:text-black transition-colors duration-300 ease-in-out">
                  LOGIN
                </button>
              </NavLink>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold text-xl cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl overflow-hidden animate-slideDown">
                  <div className="px-4 py-3 bg-white text-black">
                    <p className="font-bold text-lg">{user?.fullName}</p>
                    <p className="text-sm opacity-90">{user?.email}</p>
                    {user?.carModel && (
                      <p className="text-xs opacity-80 mt-1"> {user?.carModel}</p>
                    )}
                  </div>

                  <div className="py-2">
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/dashboard');
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/settings');
                      }}
                    >
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-gray-200">
                    <button
                      className="w-full px-4 py-3 text-left cursor-pointer text-red-600 hover:bg-red-500 hover:text-black font-semibold transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="h-[15vh]"></div>
    </>
  );
}

export default Navbar;
