import React, { useState } from 'react';
import { Mail, Phone, MapPin, Shield, Users, Target, Award, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function CarSafetyWebsite() {
  const [activePage, setActivePage] = useState('about');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('Thank you for your message! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitStatus(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SafeDrive</span>
            </div>
            <div className="flex gap-4">
              <NavLink to="/">
              <button
                
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activePage === 'about'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              </NavLink>
              
            </div>
          </div>
        </div>
      </nav>

      {/* About Page */}
      {activePage === 'about' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About SafeDrive
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated to making roads safer for everyone through education, technology, and advocacy
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At SafeDrive, we believe that every journey should end safely. Our mission is to reduce traffic accidents and save lives through comprehensive car safety information, cutting-edge research, and community education.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We work tirelessly to provide drivers, passengers, and families with the knowledge and tools they need to make informed decisions about vehicle safety, driving practices, and accident prevention.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                We prioritize evidence-based safety information and recommendations to protect lives on the road.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600">
                Building a supportive community where everyone can learn and share experiences about road safety.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Committed to providing accurate, up-to-date information backed by research and expert analysis.
              </p>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Vehicle Safety Ratings</h3>
                <p className="text-blue-100">
                  Comprehensive analysis of crash test results and safety features across all major vehicle manufacturers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Driver Education</h3>
                <p className="text-blue-100">
                  Resources and guides on defensive driving, road awareness, and best safety practices.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technology Reviews</h3>
                <p className="text-blue-100">
                  In-depth coverage of advanced safety technologies like autonomous emergency braking and lane assistance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advocacy</h3>
                <p className="text-blue-100">
                  Working with policymakers and manufacturers to promote higher safety standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}