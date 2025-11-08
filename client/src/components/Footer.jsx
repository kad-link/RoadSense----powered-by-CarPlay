import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">ROADSENSE</h3>
            <p className="text-sm mb-4">
              Your trip safety is now our priority
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
         <div>
  <h4 className="text-white font-semibold mb-4 flex flex-col gap-y-2">Quick Links</h4>
  <ul className="space-y-2 text-sm">
    <li>
      <NavLink to="/about" className="hover:text-white transition-colors">
        About Us
      </NavLink>
    </li>
    <li>
      <a href="#services" className="hover:text-white transition-colors">
        Services
      </a>
    </li>
    <li>
      <NavLink to="/contact" className="hover:text-white transition-colors">
        Contact
      </NavLink>
    </li>
  </ul>
</div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
             <NavLink to="https://echallan.parivahan.gov.in/index/accused-challan"> <li><p href="#" className="hover:text-white transition-colors">E-Challans</p></li></NavLink>
             <NavLink to="/nav-maps"> <li><p  className="hover:text-white transition-colors">Navigate</p></li></NavLink>
             <NavLink to="/trips"> <li><p  className="hover:text-white transition-colors">Your Trips</p></li></NavLink>
             <NavLink to="/docs"> <li><p  className="hover:text-white transition-colors">Vehicle Documents</p></li></NavLink>
             <NavLink to="/safety"> <li><p  className="hover:text-white transition-colors">Safety</p></li></NavLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>Ahmamau, IIIT-L, Lucknow, 226002</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+91 7989168219</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>lit2024002@iiitl.ac.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2024 ROADSENSE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.bmw.in/en/footer/metanavigation/privacy-policy.html" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://www.bmw.in/en/footer/metanavigation/bmw-connected-drive-tnc.html" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;