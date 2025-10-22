import React from 'react';
import Navbar from '../components/Navbar';

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p>Your dashboard content goes here...</p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;