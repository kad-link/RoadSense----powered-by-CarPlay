import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

function MainPage() {
  const {user} = useAuth();
  
  return (
    <div className='main-page w-full bg-transparent min-h-[calc(100vh-15vh)] flex items-center justify-center px-4'>
        <div className='flex flex-col items-center max-w-5xl mx-auto'>
            <div className='caption text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center tracking-tighter font-light'>
                THE SMARTER WAY TO DRIVE
            </div>
            <div className='nutshell text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center tracking-tight font-extralight mt-10 md:mt-20 w-full md:w-4/5 px-4'>
              Stay alert, stay safe — RoadSense uses AI to detect driver fatigue, monitor seatbelts, and keep your vehicle documents organized, all while guiding you through intelligent maps
            </div>
            
            <button 
              className="relative overflow-hidden text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter mt-8 md:mt-12 cursor-pointer border-2 border-white px-6 py-1 rounded-md
              before:absolute before:inset-0 before:bg-white before:translate-x-[-100%] before:transition-transform before:duration-500 before:ease-out
              hover:before:translate-x-0 hover:text-black transition-all hover:scale-105"
              >
                {user ? (
                  <a href='#services'>
                    <span className="relative z-10">Explore ▼</span>
                  </a>
                ):(
                  <NavLink to="/register">
                    <span className="relative z-10">Get Started →</span>
                  </NavLink>
                )}
            </button>
        </div>
    </div>
  )
}

export default MainPage