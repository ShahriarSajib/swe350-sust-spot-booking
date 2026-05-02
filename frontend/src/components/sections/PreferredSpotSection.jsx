import React from "react";
import preferred1 from "../../assets/central_auditorium.png";
import preferred2 from "../../assets/mini_auditorium.png";
import preferred3 from "../../assets/central_field.jpg";
import preferred4 from "../../assets/handball_ground.png";
import preferred5 from "../../assets/basketball_ground.png";

import { useNavigate } from "react-router-dom";

const PreferredSpotSection = () => {
  const navigate = useNavigate();
  
  // Get userType from localStorage
  const userType = localStorage.getItem("userType");

  const allSpots = [
    {
      id: 1,
      name: "Central Auditorium",
      image: preferred1,
      span: "lg:col-span-6",
      height: "h-[300px]",
      isExternalAllowed: true // Flag to allow external users
    },
    {
      id: 2,
      name: "Mini Auditorium",
      image: preferred2,
      span: "lg:col-span-6",
      height: "h-[300px]",
      isExternalAllowed: false
    },
    {
      id: 3,
      name: "Central Field",
      image: preferred3,
      span: "lg:col-span-4",
      height: "h-[260px]",
      isExternalAllowed: false
    },
    {
      id: 4,
      name: "Handball Ground",
      image: preferred4,
      span: "lg:col-span-4",
      height: "h-[260px]",
      isExternalAllowed: false
    },
    {
      id: 5,
      name: "Basketball Ground",
      image: preferred5,
      span: "lg:col-span-4",
      height: "h-[260px]",
      isExternalAllowed: false
    }
  ];

  const handleNavigation = (spot) => {
    // Prevent navigation if external and spot is restricted
    if (userType === "external" && !spot.isExternalAllowed) {
      return; // Do nothing
    }
    
    localStorage.setItem('selectedSpotId', spot.id);
    navigate(`/spot/${spot.id}`);
  };

  return (
    <section className="w-full bg-[#CCCCCC] py-20 px-4 font-sans">
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Choose Your
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
            {" "}Preferred Spot
          </span>
        </h2>
        {userType === "external" && (
            <p className="text-red-600 font-bold text-sm">
                * Note: External users are restricted to Central Auditorium bookings only.
            </p>
        )}
      </div>

      {/* Spots Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        {allSpots.map((spot) => {
          const isRestricted = userType === "external" && !spot.isExternalAllowed;

          return (
            <div
              key={spot.id}
              onClick={() => handleNavigation(spot)}
              className={`relative group overflow-hidden rounded-3xl ${spot.span} 
                ${isRestricted ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {/* Image with Grayscale filter if restricted */}
              <div
                className={`${spot.height} bg-cover bg-center transition-transform duration-700 
                  ${isRestricted ? "grayscale blur-[2px]" : "group-hover:scale-110"}`}
                style={{ backgroundImage: `url(${spot.image})` }}
              />

              {/* Overlay */}
              <div className={`absolute inset-0 transition-colors 
                ${isRestricted ? "bg-black/60" : "bg-black/40 group-hover:bg-black/55"}`} 
              />

              {/* Text / Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-white text-xl font-black text-center px-2">
                  {spot.name}
                </h3>
                {isRestricted && (
                  <span className="mt-2 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                    Internal Only
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PreferredSpotSection;