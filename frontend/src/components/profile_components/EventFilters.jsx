import React from 'react';
import { Grid, CheckCircle, Clock, History } from 'lucide-react';

const EventFilters = ({ currentCategory, setCategory }) => {
    const categories = [
        { id: "all", label: "All", icon: Grid },
        { id: "upcoming", label: "Upcoming", icon: CheckCircle },
        { id: "pending", label: "Pending", icon: Clock },
        { id: "past", label: "Past", icon: History },
    ];

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            currentCategory === cat.id 
                            ? "bg-white text-sky-700 shadow-sm" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <cat.icon size={14} />
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EventFilters;