import React from 'react'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import InfoCard from '../components/InfoCard'
import { NavLink } from 'react-router-dom'

function Trips() {
  return (
    <div className='bg-gray-900 w-full min-h-screen'>

        <div className='header-div p-10 flex flex-row justify-between items-center'>
            <div>
            <h1 className='text-white text-6xl font-light tracking-tighter'>
                Your Trips
            </h1>
            <h2 className=' text-lg font-light mt-3 text-gray-400'>
                Glance at your past Google Maps searches and journeys
            </h2>
            </div>
            <div>
            <NavLink to="/">
            <button className='bg-white cursor-pointer text-black px-4 rounded-lg'>Back</button>
            </NavLink>
            </div>
        </div>

        <div className='Total-Stats-div flex flex-wrap gap-15 justify-center'>
            <StatsCard  title="Total Trips" info="6"/>
            <StatsCard  title="Total Distance" info="2898 Km"/>
            <StatsCard  title="Total Duration" info="29h 45m"/>
        </div>  
        <div className='history-div p-5 text-white flex flex-wrap gap-y-5 mt-10'>
            <InfoCard />
            <InfoCard />
            <InfoCard />
            <InfoCard />
            <InfoCard />
        </div>
    </div>
  )
}

export default Trips