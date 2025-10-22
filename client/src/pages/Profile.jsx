import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Full Name:</label>
              <p className="text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            {user?.carModel && (
              <div>
                <label className="font-semibold text-gray-700">Car Model:</label>
                <p className="text-gray-900">{user?.carModel}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;