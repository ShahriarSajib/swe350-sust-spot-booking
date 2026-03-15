import React from 'react';
import { MapPin, Image as ImageIcon, BookOpen } from "lucide-react";

export default function SpotHeader({ spot, setShowGallery }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <div className="relative">
        <img src={`http://localhost:5000/uploads/${spot.display_image}`} alt={spot.name} className="w-full h-80 object-cover" />
        <button
          onClick={() => setShowGallery(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-lg hover:bg-white transition-all"
        >
          <span className="text-sm font-bold text-gray-800">Spot Gallery</span>
          <ImageIcon size={16} className="text-[#0052cc]" />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">{spot.name}</h1>
        <p className="text-gray-500">{spot.description}</p>
        
        <div className="flex gap-3">
          <MapPin className="text-[#0052cc] mt-1" />
          <div className="flex flex-col items-start">
            <p className="font-bold">Location</p>
            <p className="text-sm text-gray-500 mb-2">{spot.location}</p>
            <button
              onClick={() => window.open(spot.mapUrl, '_blank')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-all"
            >
              See location in Google Map
            </button>
          </div>
        </div>

        <h3 className="font-bold flex gap-2 items-center pt-4">
          <BookOpen size={20} className="text-[#0052cc]" /> Usage Rules
        </h3>
        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-500 pb-4">
          {spot.rules?.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-[#0052cc]">•</span> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}