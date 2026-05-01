import { BookOpen, Image as ImageIcon, MapPin } from "lucide-react";

export default function SpotHeader({ spot, setShowGallery }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <div className="relative">
        <img
          src={`http://localhost:5000/uploads/${spot.image1}`}
          alt={spot.name}
          className="w-full h-80 object-cover"
        />
        <button
          onClick={() => setShowGallery(true)} // এটি এখন মেইন পেজের স্টেটকে true করবে
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
            <button
              onClick={() => window.open(spot.location, "_blank")}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-all"
            >
              See location in Google Map
            </button>
          </div>
        </div>
        <h3 className="font-bold flex gap-2 items-center pt-4">
          <BookOpen size={20} className="text-[#0052cc]" /> Usage Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {spot.rules &&
            spot.rules.length > 0 &&
            (typeof spot.rules[0] === "string"
              ? spot.rules[0]
              : spot.rules.toString()
            )
              .split(/\n+/)
              .map((rule) => rule.trim())
              .filter((rule) => rule.length > 0)
              .map((rule, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="min-w-[8px] h-[8px] rounded-full bg-blue-500 mt-2"></div>

                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {rule}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
