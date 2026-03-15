import preferred1 from "../../assets/central_auditorium.png";
import preferred2 from "../../assets/mini_auditorium.png";
import preferred3 from "../../assets/central_field.jpg";
import preferred4 from "../../assets/handball_ground.png";
import preferred5 from "../../assets/basketball_ground.png";

import { useNavigate } from "react-router-dom";

const PreferredSpotSection = () => {

  const navigate = useNavigate();

  const spots = [
    {
      id: 1,
      name: "Central Auditorium",
      image: preferred1,
      span: "lg:col-span-6",
      height: "h-[300px]"
    },
    {
      id: 2,
      name: "Mini Auditorium",
      image: preferred2,
      span: "lg:col-span-6",
      height: "h-[300px]"
    },
    {
      id: 3,
      name: "Central Field",
      image: preferred3,
      span: "lg:col-span-4",
      height: "h-[260px]"
    },
    {
      id: 4,
      name: "Handball Ground",
      image: preferred4,
      span: "lg:col-span-4",
      height: "h-[260px]"
    },
    {
      id: 5,
      name: "Basketball Ground",
      image: preferred5,
      span: "lg:col-span-4",
      height: "h-[260px]"
    }
  ];

  const handleNavigation = (id) => {
    localStorage.setItem('selectedSpotId', id);
    navigate(`/spot/${id}`);
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
      </div>

      {/* Spots Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">

        {spots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => handleNavigation(spot.id)}
            className={`relative group cursor-pointer overflow-hidden rounded-3xl ${spot.span}`}
          >

            <div
              className={`${spot.height} bg-cover bg-center transition-transform duration-700 group-hover:scale-110`}
              style={{ backgroundImage: `url(${spot.image})` }}
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors" />

            {/* text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl font-black text-center px-2">
                {spot.name}
              </h3>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default PreferredSpotSection;