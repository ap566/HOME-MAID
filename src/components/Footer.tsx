import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-gray-900 text-gray-300 border-t border-gray-800 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div id="footer-column-brand" className="space-y-4">
            <div 
              onClick={() => setActiveTab('home')}
              className="flex cursor-pointer items-center space-x-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                HOME<span className="text-teal-400">-MAID</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your Trusted Partner for Home Care Services. Providing reliable, pre-trained, and vetted domestic helpers to elevate your family comfort and cleanliness.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition" id="footer-social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition" id="footer-social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition" id="footer-social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition" id="footer-social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Navigations */}
          <div id="footer-column-links" className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-teal-400 transition cursor-pointer">
                  Home Screen
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-teal-400 transition cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-teal-400 transition cursor-pointer">
                  Explore Services
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('booking')} className="hover:text-teal-400 transition cursor-pointer">
                  Book A helper
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-teal-400 transition cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div id="footer-column-services" className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Our Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Regular House Cleaning</li>
              <li>Child Care Assistance</li>
              <li>Adult / Elder Care</li>
              <li>Fresh Meal Cooking</li>
              <li>Detailed Deep Cleaning</li>
              <li>Laundry & Folding</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div id="footer-column-contacts" className="space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-400" />
                <span>101 Ocean Breeze Tower, Downtown, DC 10005</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4.5 w-4.5 shrink-0 text-teal-400" />
                <span>+1 (555) HOME-MAID</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-teal-400" />
                <span>care@home-maid.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {currentYear} HOME-MAID Platform. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            <span>Delivering comfort and cleanliness with</span>
            <Heart className="mx-1 h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>every visit</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
