import React from 'react'
import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 


function MainPage() {

  const {user} = useAuth();
  const sign= ">";
  
  return (
    <div className='main-page w-full bg-transparent h-100  mt-40'>
        <div className='flex flex-col items-center pt-5'>
            <div className='caption text-white text-7xl text-center tracking-tighter font-light'>
                THE SMARTER WAY TO DRIVE
            </div>
            <div className='nutshell text-white text-2xl text-center tracking-tighter font-extralight mt-20 w-3/4'>
              Stay alert, stay safe — RoadSense uses AI to detect driver fatigue, monitor seatbelts, and keep your vehicle documents organized, all while guiding you through intelligent maps
            </div>
            
            <button 
              className="relative overflow-hidden text-white text-4xl font-bold tracking-tighter mt-5 cursor-pointer border-2 border-white px-3 py-1 rounded-md
              before:absolute before:inset-0 before:bg-white before:translate-x-[-100%] before:transition-transform before:duration-500 before:ease-out
              hover:before:translate-x-0 hover:text-black"
              >
                {user ? (
                  <a href='#services'>
                  <span className="relative z-10">Explore ▼</span>
                  </a>
                ):(
                  <NavLink to="/register">
                  <span className="relative z-10">Get Started -{sign}</span>
                   </NavLink>
                )}
              
            </button>
           
        </div>
    </div>
  )
}

export default MainPage