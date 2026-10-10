import React from 'react';
import { Tractor, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Tractor className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Agri<span className="text-emerald-400">Rent</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering farmers across the country with instant on-demand access to modern tractors, harvesters, tillers, and irrigation equipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Equipment
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/catalog?category=TRACTORS" className="hover:text-emerald-400 transition-colors">Tractors & Haulers</Link></li>
              <li><Link to="/catalog?category=HARVESTING" className="hover:text-emerald-400 transition-colors">Combine Harvesters</Link></li>
              <li><Link to="/catalog?category=TILLAGE" className="hover:text-emerald-400 transition-colors">Rotavators & Tillers</Link></li>
              <li><Link to="/catalog?category=SOWING_PLANTING" className="hover:text-emerald-400 transition-colors">Seeders & Planters</Link></li>
              <li><Link to="/catalog?category=IRRIGATION" className="hover:text-emerald-400 transition-colors">Solar & Diesel Pumps</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Equipment Owners
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/owner/add-equipment" className="hover:text-emerald-400 transition-colors">List Your Machinery</Link></li>
              <li><Link to="/owner/dashboard" className="hover:text-emerald-400 transition-colors">Manage Bookings</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Partner as Vendor</Link></li>
              <li><span className="text-emerald-400 text-xs font-semibold">Zero Commission for first 30 days!</span></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Direct Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 1800-AGRI-RENT (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@agrirent.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>National Kisan Tech Hub, New Delhi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} AgriRent Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Agriculture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
