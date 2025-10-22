// import { FaLocationArrow, FaTimes } from 'react-icons/fa'
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
// } from '@react-google-maps/api'
// import { useRef, useState } from 'react'

// const center = { lat: 26.8, lng: 81.02 }

// function Maps() {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ['places'],
//   })

//   const [map, setMap] = useState(null)
//   const [directionsResponse, setDirectionsResponse] = useState(null)
//   const [distance, setDistance] = useState('')
//   const [duration, setDuration] = useState('')

//   const originRef = useRef()
//   const destinationRef = useRef()

//   if (!isLoaded) {
//     return (
//       <div className="space-y-3 p-4">
//         <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//         <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
//         <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
//       </div>
//     )
//   }

//   async function calculateRoute() {
//     if (originRef.current.value === '' || destinationRef.current.value === '') {
//       return
//     }
//     const directionsService = new google.maps.DirectionsService()
//     const results = await directionsService.route({
//       origin: originRef.current.value,
//       destination: destinationRef.current.value,
//       travelMode: google.maps.TravelMode.DRIVING,
//     })
//     setDirectionsResponse(results)
//     setDistance(results.routes[0].legs[0].distance.text)
//     setDuration(results.routes[0].legs[0].duration.text)
//   }

//   function clearRoute() {
//     setDirectionsResponse(null)
//     setDistance('')
//     setDuration('')
//     originRef.current.value = ''
//     destinationRef.current.value = ''
//   }

//   return (
//     <div className="relative flex flex-col items-center h-screen w-screen">
//       <div className="absolute left-0 top-0 h-full w-full">
//         <GoogleMap
//           center={center}
//           zoom={12}
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//           options={{
//             zoomControl: true,
//             streetViewControl: true,
//             mapTypeControl: true,
//             fullscreenControl: true,
//           }}
//           onLoad={map => setMap(map)}
//         >
//           <Marker position={center} />
//           {directionsResponse && (
//             <DirectionsRenderer directions={directionsResponse} />
//           )}
//         </GoogleMap>
//       </div>
//       <div className="p-4 rounded-lg m-4 bg-white shadow-md min-w-[768px] z-10">
//         <div className="flex items-center justify-between space-x-2">
//           <div className="flex-grow">
//             <Autocomplete>
//               <input
//                 type="text"
//                 placeholder="Origin"
//                 ref={originRef}
//                 className="w-full px-4 py-2 border border-black rounded-md outline-none focus:ring-2"
//               />
//             </Autocomplete>
//           </div>
//           <div className="flex-grow">
//             <Autocomplete>
//               <input
//                 type="text"
//                 placeholder="Destination"
//                 ref={destinationRef}
//                 className="w-full px-4 py-2 border border-black rounded-md outline-none focus:ring-2 "
//               />
//             </Autocomplete>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={calculateRoute}
//               className="px-4 py-2 bg-black text-white rounded-md 
//          hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 
//          hover:scale-105 active:scale-95 
//          shadow-md hover:shadow-xl 
//          transition-all duration-300 ease-out"
//             >
//               Navigate Route
//             </button>
//             <button
//               onClick={clearRoute}
//               className="p-2 bg-gray-200
//                text-gray-700 rounded-md
//                 hover:bg-gray-300 focus:outline-none
//                  cursor-pointer transition-colors"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         </div>
//         <div className="flex items-center justify-between space-x-4 mt-4">
//           <p className="text-gray-900">Distance: {distance}</p>
//           <p className="text-gray-900">Duration: {duration}</p>
//           <button
//             onClick={() => {
//               map.panTo(center)
//               map.setZoom(15)
//             }}
//             className="p-3 bg-gray-200
//              text-gray-700 rounded-full
//               hover:bg-gray-300 cursor-pointer 
//               transition-colors"
//           >
//             <FaLocationArrow />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Maps

import { useState, useRef } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  TransitLayer,
  BicyclingLayer,
} from '@react-google-maps/api';
import { FaLocationArrow, FaTimes, FaPlus, FaCar, FaBus, FaBicycle, FaWalking, FaEdit, FaTrash } from 'react-icons/fa';

const center = { lat: 26.8, lng: 81.02 };

const TRAVEL_MODES = {
  DRIVING: { icon: FaCar, label: 'Driving', mode: 'DRIVING' },
  TRANSIT: { icon: FaBus, label: 'Transit', mode: 'TRANSIT' },
  BICYCLING: { icon: FaBicycle, label: 'Bicycling', mode: 'BICYCLING' },
  WALKING: { icon: FaWalking, label: 'Walking', mode: 'WALKING' },
};

function Maps() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentTravelMode, setCurrentTravelMode] = useState('DRIVING');
  const [showTransitLayer, setShowTransitLayer] = useState(false);
  const [showBicyclingLayer, setShowBicyclingLayer] = useState(false);

  const originRef = useRef();
  const destinationInputRef = useRef();

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
    const origin = originRef.current?.value || `${center.lat} , ${center.lng}`;
     
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

      // Update layers based on travel mode
      setShowTransitLayer(travelMode === 'TRANSIT');
      setShowBicyclingLayer(travelMode === 'BICYCLING');

      // Fit bounds to show the route
      if (map) {
        map.fitBounds(results.routes[0].bounds);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Could not calculate route. Please try again.');
    }
  }

  function handleAddDestination() {
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
    // Reassign labels
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
    setShowBicyclingLayer(destination.travelMode === 'BICYCLING');
    
    if (map && destination.directions) {
      map.fitBounds(destination.directions.routes[0].bounds);
    }
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} label="●" />
          
          {showTransitLayer && <TransitLayer />}
          {showBicyclingLayer && <BicyclingLayer />}
          
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

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg bg-white shadow-lg min-w-[600px] z-10">
        <div className="flex items-center space-x-2">
          <Autocomplete className="flex-1">
            <input
              type="text"
              placeholder="Your location (origin)"
              ref={originRef}
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