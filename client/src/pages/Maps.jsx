import { useState, useRef, useEffect } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  TransitLayer,
} from '@react-google-maps/api';
import { FaLocationArrow,FaSignOutAlt, FaTimes,FaUser,  FaPlus, FaCar, FaBus, FaWalking, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext";
import { NavLink,useNavigate } from 'react-router-dom';


const center = { lat: 17.6974, lng: 83.2990 };

const TRAVEL_MODES = {
  DRIVING: { icon: FaCar, label: 'Driving', mode: 'DRIVING' },
  TRANSIT: { icon: FaBus, label: 'Transit', mode: 'TRANSIT' },
  WALKING: { icon: FaWalking, label: 'Walking', mode: 'WALKING' },
};

function Maps() {


  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
  
          if(!user){
              navigate("/"); 
              return ;
          }
  
              
          
      },[ user, navigate])
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  

  const [map, setMap] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentTravelMode, setCurrentTravelMode] = useState('DRIVING');
  const [showTransitLayer, setShowTransitLayer] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const originRef = useRef();
  const destinationInputRef = useRef();


  function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(pos);
        setLoading(false); 
        if (originRef.current) {
          originRef.current.value = { lat: pos.lat, lng: pos.lng };
        }
        if (map) {
          map.panTo(pos);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter manually.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

useEffect(()=>{
  getCurrentLocation();
},[])

  if(loading){
    return <div>Fetching location . . .</div>
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userLocation) {
    return <div>No location available.</div>;
  }



  if (!isLoaded) {
    return (
      <div className="space-y-3 p-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
      </div>
    );
  }


  async function calculateRoute(destination, travelMode, isEditing = false, index = null) {
    const origin = originRef.current?.value ;
     
    if (!destination) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
      });

      const route = results.routes[0].legs[0];
      const newDestination = {
        name: destination,
        distance: route.distance.text,
        duration: route.duration.text,
        travelMode: travelMode,
        directions: results,
        label: isEditing ? destinations[index].label : String.fromCharCode(65 + destinations.length),
      };

      if (isEditing && index !== null) {
        const updatedDestinations = [...destinations];
        updatedDestinations[index] = newDestination;
        setDestinations(updatedDestinations);
        setActiveDestinationIndex(index);
      } else {
        setDestinations([...destinations, newDestination]);
        setActiveDestinationIndex(destinations.length);
      }

      setShowTransitLayer(travelMode === 'TRANSIT');
      

      if (map) {
        map.fitBounds(results.routes[0].bounds);
      }

      if(user?.email && token){
      const response = await fetch(`http://localhost:3000/trip/${user.email}`,{
          method:"POST",
          headers:{
            "Content-Type" : "application/json",
            // "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            source: origin,
            destination: destination,
            duration:route.duration.text ,
            distance: route.distance.text,
          })
        })

        if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    const errorData = await response.text();
    console.error('Error details:', errorData);
    return;
  }


        const data =await response.json();
        if(response.ok && data.success){
          console.log("Trip details stored in database ...");
        }
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Inaccessible Route. Please try again');
    }
  }

     

  async function handleAddDestination() {
    const destination = destinationInputRef.current?.value;
    if (!destination) {
      alert('Please enter a destination');
      return;
    }

    if (editingIndex !== null) {
      calculateRoute(destination, currentTravelMode, true, editingIndex);
      setEditingIndex(null);
    } else {
      calculateRoute(destination, currentTravelMode, false);
    }

    setShowModal(false);
    if (destinationInputRef.current) {
      destinationInputRef.current.value = '';
    }
  }

  function handleEditDestination(index) {
    setEditingIndex(index);
    setCurrentTravelMode(destinations[index].travelMode);
    setShowModal(true);
  }

  function handleDeleteDestination(index) {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    const relabeledDestinations = updatedDestinations.map((dest, i) => ({
      ...dest,
      label: String.fromCharCode(65 + i),
    }));
    setDestinations(relabeledDestinations);
    
    if (activeDestinationIndex === index) {
      setActiveDestinationIndex(relabeledDestinations.length > 0 ? 0 : null);
    } else if (activeDestinationIndex > index) {
      setActiveDestinationIndex(activeDestinationIndex - 1);
    }
  }

  function handleDestinationClick(index) {
    setActiveDestinationIndex(index);
    const destination = destinations[index];
    setShowTransitLayer(destination.travelMode === 'TRANSIT');
    
    
    if (map && destination.directions) {
      map.fitBounds(destination.directions.routes[0].bounds);
    }
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        <GoogleMap
          center={userLocation}
          zoom={10}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={userLocation} label="●" />
          
          {showTransitLayer && <TransitLayer />}
          
          
          {destinations.map((dest, index) => (
            index === activeDestinationIndex && dest.directions && (
              <DirectionsRenderer 
                key={index}
                directions={dest.directions}
                options={{
                  polylineOptions: {
                    strokeColor: '#4285F4',
                    strokeWeight: 5,
                  },
                }}
              />
            )
          ))}
        </GoogleMap>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 bg-white rounded-full shadow-lg px-4 py-2 hover:shadow-xl transition-shadow"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <span className="font-medium text-gray-700">{user?.fullName || 'User'}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-30">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName || 'User'}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              <NavLink 
              to="/"
              className="ml-3 "
              >
                Go Back
              </NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg bg-white shadow-lg min-w-[600px] z-10">
        <div className="flex items-center space-x-2">
          <Autocomplete className="flex-1">
            <input
              type="text"
              ref={originRef}
              placeholder={`Enter source : ${userLocation?.lat ?? ''} ${userLocation?.lng ?? ''}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Autocomplete>
          <button
            onClick={() => {
              map.panTo(center);
              map.setZoom(12);
            }}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            title="Reset to center"
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>

      
      {destinations.length === 0 ? (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-6 rounded-lg bg-white shadow-lg min-w-[600px] z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Estimate commute time</h2>
              <p className="text-gray-600 text-sm">See travel time and directions for places nearby</p>
            </div>
            <button
              onClick={() => {
                setShowModal(true);
                setEditingIndex(null);
                setCurrentTravelMode('DRIVING');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Add destination</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg bg-white shadow-lg min-w-[800px] max-w-[90vw] z-10">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {destinations.map((dest, index) => {
              const TravelIcon = TRAVEL_MODES[dest.travelMode].icon;
              const isActive = index === activeDestinationIndex;
              
              return (
                <div
                  key={index}
                  onClick={() => handleDestinationClick(index)}
                  className={`flex-shrink-0 w-64 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  }`}
                >
                  {isActive && <div className="h-1 bg-blue-500 rounded-t-lg -mt-3 -mx-3 mb-2"></div>}
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TravelIcon className="text-gray-500" />
                      <span>{dest.distance}</span>
                      <span className="font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">
                        {dest.label}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDestination(index);
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDestination(index);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-1 truncate">
                    To {dest.name}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{dest.duration}</div>
                </div>
              );
            })}
            
            <button
              onClick={() => {
                setShowModal(true);
                setEditingIndex(null);
                setCurrentTravelMode('DRIVING');
              }}
              className="flex-shrink-0 w-40 h-32 flex flex-col items-center justify-center space-y-2 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaPlus size={24} />
              <span className="font-semibold">Add destination</span>
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingIndex !== null ? 'Edit destination' : 'Add destination'}
            </h2>
            
            <Autocomplete>
              <input
                type="text"
                placeholder="Enter a place or address"
                ref={destinationInputRef}
                defaultValue={editingIndex !== null ? destinations[editingIndex].name : ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
            </Autocomplete>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {Object.entries(TRAVEL_MODES).map(([key, { icon: Icon, label }]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTravelMode(key)}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-md transition-all ${
                    currentTravelMode === key
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                  title={label}
                >
                  <Icon size={24} />
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              {editingIndex !== null && (
                <button
                  onClick={() => {
                    handleDeleteDestination(editingIndex);
                    setShowModal(false);
                    setEditingIndex(null);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-semibold"
                >
                  Delete
                </button>
              )}
              <div className="flex space-x-2 ml-auto">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingIndex(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDestination}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  {editingIndex !== null ? 'Done' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maps;