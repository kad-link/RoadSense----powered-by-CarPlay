import React, { useState } from 'react';
import { Mail, Phone, MapPin, Shield, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const {user} = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [error,setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSubmitStatus('');

  const payload = {
    name: user?.fullName || formData.name,
    email: user?.email || formData.email,
    subject: formData.subject,
    message: formData.message
  };

  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    setError('Please fill in all fields');
    return;
  }

  try {
    console.log('Sending email with data:', payload); 
    const response = await fetch('http://localhost:3000/send-email', {  
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setSubmitStatus('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({  subject: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 5000);
    } else {
      setError(data.message || 'Failed to send message. Please try again.');
    }
  } catch (err) {
    setError('Network error. Please check your connection and try again.');
    console.error('Submit error:', err);
  } 
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">ROADSENSE</span>
            </div>
            <div className="flex gap-4">
              
              <NavLink
                to="/"
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
              >
                Home
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about road safety? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitStatus && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                {submitStatus}
              </div>
            )}

            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={user?.fullName || ""}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  outline-none transition"
                  placeholder="Your full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg   outline-none transition"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 cursor-pointer text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">lit2024002@iiitl.ac.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 7989168219</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      Ahmamau<br />
                      IIITL<br />
                      Lucknow, UP 226002
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Active Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}