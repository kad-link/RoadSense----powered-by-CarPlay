// import React from 'react'

// function Challan() {
//   return (
//     <div className='p-10'>
//         <div>
//             <h1 className='text-4xl tracking-tighter'>Confirm your car's Registration No. </h1>
//         </div>
//         <div className='mt-10'>
//           <label 
//           htmlFor='registration-number'
//           className=''
//           >Vehicle Registration No. 
//           <span className='text-red-500'>*</span>
//           </label>
//           <input 
//           type='text' 
//           defaultValue='AP31CV3106' 
//           id='registration-number' 
//           name='registration-number'
//           className='border rounded-md px-2 font-extralight tracking-widest outline-none ml-3'
//           required
//           />
//           </div>
//           <div>
//             <button 
//             className='font-bold mt-10 border px-5 rounded-md cursor-pointer'
            
//             >
//                 Fetch
//             </button>
//           </div>
//     </div>
//   )
// }

// export default Challan









// React Frontend Component with Tailwind CSS
// ChallanChecker.jsx

import React, { useState } from 'react';
import axios from 'axios';

const ChallanChecker = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const formatVehicleNumber = (value) => {
    return value.replace(/\s/g, '').toUpperCase();
  };

  const handleInputChange = (e) => {
    const formatted = formatVehicleNumber(e.target.value);
    setVehicleNumber(formatted);
    setError('');
    setResult(null);
  };

  const validateVehicleNumber = (number) => {
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    return regex.test(number);
  };

  const checkChallan = async (e) => {
    e.preventDefault();
    
    if (!validateVehicleNumber(vehicleNumber)) {
      setError('Invalid vehicle number format. Example: DL01AB1234');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3000/api/challan', {
        vehicleNumber: vehicleNumber
      });

      setResult(response.data);
      
      if (response.data.success && response.data.challans.length > 0) {
        console.log('✅ Challans found:', response.data.challans);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'Failed to fetch challan data. Please try again.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    if (!result || !result.challans) return 0;
    return result.challans.reduce((sum, challan) => {
      const amount = parseInt(challan.amount) || 0;
      return sum + amount;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            🚗 Traffic Challan Checker
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Check pending traffic challans from eChallan Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={checkChallan} className="mb-6">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={handleInputChange}
              placeholder="e.g., DL01AB1234"
              className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={13}
              disabled={loading}
            />
            <small className="block mt-2 text-xs text-gray-500">
              Format: State(2) + District(2) + Series(1-2) + Number(4)
            </small>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !vehicleNumber}
            className="w-full py-4 px-6 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            {loading ? '🔄 Processing...' : '🔍 Check Challans'}
          </button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              ⏳ Checking Challans...
            </h3>
            <div className="max-w-lg mx-auto bg-gray-50 p-6 rounded-xl text-left">
              <p className="font-semibold text-gray-800 mb-3 text-base">
                📋 Manual Steps Required:
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Browser window will open automatically</li>
                <li>Solve the CAPTCHA displayed on screen</li>
                <li>Click the "Get Detail" button</li>
                <li>Wait for results to load</li>
              </ol>
              <p className="mt-4 p-3 bg-teal-50 border-l-4 border-teal-500 text-teal-800 text-xs rounded">
                ⚡ The system will automatically detect and fetch results after you click "Get Detail"
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && result.success && (
          <div className="mt-8">
            {/* Result Header */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                📊 Results for {result.vehicleNumber}
              </h3>
              {result.challans.length > 0 && (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                  {result.challans.length} Challan{result.challans.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {result.challans.length > 0 ? (
              <>
                {/* Challan Cards */}
                <div className="space-y-4 mb-6">
                  {result.challans.map((challan, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-200">
                        <div>
                          <span className="block text-xs text-gray-500 mb-1">
                            Challan #
                          </span>
                          <span className="text-sm font-semibold text-gray-800 font-mono">
                            {challan.challanNumber}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          ₹{challan.amount}
                        </div>
                      </div>

                      {/* Challan Details */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">👤 Name:</span>
                          <span className="text-gray-800 font-semibold">{challan.violatorName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">📅 Date:</span>
                          <span className="text-gray-800 font-semibold">{challan.challanDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">📍 State:</span>
                          <span className="text-gray-800 font-semibold">{challan.state}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">🏢 Department:</span>
                          <span className="text-gray-800 font-semibold">{challan.department}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">📋 Status:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              challan.status === 'Pending'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {challan.status}
                          </span>
                        </div>
                        {challan.transactionId !== 'N/A' && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">💳 Transaction ID:</span>
                            <span className="text-gray-800 font-semibold">{challan.transactionId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Amount Box */}
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                  <span className="text-lg font-semibold">Total Amount Due:</span>
                  <span className="text-3xl font-bold">₹{getTotalAmount()}</span>
                </div>
              </>
            ) : (
              // No Challans Found
              <div className="text-center py-16 bg-green-50 rounded-xl">
                <span className="text-6xl block mb-4">✅</span>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  Great News!
                </h3>
                <p className="text-green-700 text-base">
                  {result.message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-6 text-center">
        <p className="text-white text-sm mb-2 drop-shadow-md">
          💡 <strong>Note:</strong> This tool fetches data from the official eChallan portal (echallan.parivahan.gov.in)
        </p>
        <p className="text-white text-sm drop-shadow-md">
          🔒 Your data is processed securely and not stored anywhere
        </p>
      </div>
    </div>
  );
};

export default ChallanChecker;