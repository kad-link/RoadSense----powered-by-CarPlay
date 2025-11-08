import React from 'react'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import InfoCard from '../components/InfoCard'
import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";



function Trips() {


    const {user, token,logout,loading} = useAuth();
    const navigate = useNavigate();


    const [trips,setTrips] =useState([]);
    const [webloading, setLoading] = useState(true);

    

    useEffect(()=>{

        if(loading) return ;
        if(!user){
            // window.alert("Please Sign In first");
            navigate("/"); 
            return ;
        }

        setLoading(true); 
        fetch(`http://localhost:3000/trip/${user.email}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  
      },

        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                setTrips(data.trips);
            }
            
        })
        .catch(error => {
        console.error('Error fetching trips:', error);
        })
        .finally(()=>{
            setLoading(false)
            });
            
        
    },[ user,loading,navigate])

    const totalTrips= trips.length;

    const totalDistance = trips.reduce((sum, trip) => {
    if (!trip.distance) return sum;
    const cleanedDistance = String(trip.distance).replace(/,/g, '');
    const distanceValue = parseFloat(cleanedDistance);
    
    console.log('Original:', trip.distance, '-> Cleaned:', cleanedDistance, '-> Parsed:', distanceValue);
    return sum + (isNaN(distanceValue) ? 0 : distanceValue);
}, 0);


    const totalDurationMins = trips.reduce((sum, trip) => {
    if (!trip.duration) return sum;
    
    const durationStr = trip.duration.toLowerCase();
    let minutes = 0;

    const dayMatch = durationStr.match(/(\d+)\s*day/);
    const hourMatch = durationStr.match(/(\d+)\s*(?:hour|hr|h)s?/);
    const minMatch = durationStr.match(/(\d+)\s*(?:min|m)s?/);

    if (dayMatch) minutes += parseInt(dayMatch[1], 10) * 24 * 60;
    if (hourMatch) minutes += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) minutes += parseInt(minMatch[1], 10);

    return sum + minutes;
}, 0);

const days = Math.floor(totalDurationMins / (24 * 60));
const hours = Math.floor((totalDurationMins % (24 * 60)) / 60);
const mins = totalDurationMins % 60;

let formattedDuration = '';
if (days > 0) formattedDuration += `${days} day${days > 1 ? 's' : ''} `;
if (hours > 0) formattedDuration += `${hours}h `;
if (mins > 0 || formattedDuration === '') formattedDuration += `${mins}m`;

formattedDuration = formattedDuration.trim();

    


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
            <StatsCard  title="Total Trips" info={totalTrips}/>
            <StatsCard  title="Total Distance" info={`${totalDistance} km`}/>
            <StatsCard  title="Total Duration" info={formattedDuration}/>
        </div>  
        <div className='history-div p-5 text-white flex flex-wrap gap-y-5 mt-10'>
            {webloading? (
                <p className="text-gray-400">Loading trips...</p>
            ):trips.length==0 ?(
                <p className="text-gray-400">No trips found.</p>
            ):(
                trips.map((trip, index) => (
            <InfoCard
              key={index}
              source={trip.source}
              destination={trip.destination}
              distance={trip.distance}
              duration={trip.duration}
              date={trip.date}
            />
          ))
            )}
        </div>
    </div>
  )
}

export default Trips