import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Star, Gauge, Calendar, ShieldCheck } from 'lucide-react';

const formatCategory = (cat) => {
  if (!cat) return '';
  return cat.replace('_', ' ');
};

const EquipmentCard = ({ equipment, onBookClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={equipment.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'}
          alt={equipment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/90 backdrop-blur text-emerald-800 shadow-sm">
            {formatCategory(equipment.category)}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {equipment.isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur shadow-sm">
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-200 backdrop-blur shadow-sm">
              Reserved
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800">
                {equipment.averageRating ? equipment.averageRating.toFixed(1) : '5.0'}
              </span>
              <span>({equipment.totalReviews || 1} reviews)</span>
            </div>
            {equipment.equipmentCondition && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {equipment.equipmentCondition}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/equipment/${equipment.id}`}>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {equipment.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{equipment.city}, {equipment.state}</span>
          </div>

          {/* Machine Highlights */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {equipment.horsepower && (
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                <span>{equipment.horsepower} HP Power</span>
              </div>
            )}
            {equipment.fuelType && (
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate">{equipment.fuelType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                ₹{equipment.dailyRate?.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">/day</span>
            </div>
            <div className="text-[11px] text-slate-500">
              ₹{equipment.hourlyRate?.toLocaleString()}/hr
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/equipment/${equipment.id}`}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              Details
            </Link>
            {equipment.isAvailable && onBookClick && (
              <button
                onClick={() => onBookClick(equipment)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
