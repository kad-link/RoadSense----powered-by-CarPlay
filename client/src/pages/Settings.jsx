import React from 'react';
import Navbar from '../components/Navbar';

function Settings() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <p>Your settings content goes here...</p>
        </div>
      </div>
    </>
  );
}

export default Settings;