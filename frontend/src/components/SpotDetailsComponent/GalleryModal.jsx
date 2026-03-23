import React from 'react';
import { X } from "lucide-react";

export default function GalleryModal({ spot, onClose }) {
 
  const images = [spot.image1, spot.image2, spot.image3].filter(img => img);

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-4">
      <div className="bg-white p-6 rounded-3xl relative max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Spot Gallery</h2>
          <X 
            onClick={onClose} 
            className="text-gray-500 hover:text-black cursor-pointer w-8 h-8" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.length > 0 ? images.map((img, i) => (
            <img 
              key={i} 
              src={`http://localhost:5000/uploads/${img}`} 
              className="rounded-2xl w-full h-64 object-cover hover:scale-[1.02] transition-transform duration-300" 
              alt={`Gallery ${i}`} 
            />
          )) : (
             <p className="text-center col-span-2 py-10 text-gray-400">No gallery images found.</p>
          )}
        </div>
      </div>
    </div>
  );
}