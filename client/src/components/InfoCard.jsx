import React from 'react';
import { MapPin, Navigation, Clock, Calendar } from 'lucide-react';
import Badge from './Badge';


function InfoCard() {
  return (
    <div className="bg-gray-50 w-full max-w-md mx-auto rounded-3xl shadow-lg p-8 border border-gray-200">
      
      <div className="mb-8">
        <Badge>Road Trip</Badge>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-1">From</p>
          <p className="text-2xl font-semibold text-black">San Francisco, CA</p>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <Navigation className="w-6 h-6 text-gray-400 rotate-180" />
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center">
            <MapPin className="w-5 h-5 text-black" />
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm mb-1">To</p>
          <p className="text-2xl font-semibold text-black">Los Angeles, CA</p>
        </div>
      </div>

      <div className="border-t border-gray-300 my-8"></div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 text-base">Distance</span>
          </div>
          <span className="text-xl font-semibold text-black">383 miles</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 text-base">Duration</span>
          </div>
          <span className="text-xl font-semibold text-black">5h 45m</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600 text-base">Date</span>
          </div>
          <span className="text-xl font-semibold text-black">Oct 15, 2025</span>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;