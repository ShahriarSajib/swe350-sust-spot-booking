import { Calendar, PenLine } from "lucide-react";

const TabSwitcher = ({ selectedTab, onTabChange }) => {
  return (
    <div className="bg-gray-200/50 p-1.5 rounded-2xl flex w-fit mb-6 border border-gray-100">
      <button
        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
          selectedTab === "events"
            ? "bg-white text-sky-700 shadow-sm border border-gray-100"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => onTabChange("events")}
      >
        <Calendar size={18} /> My Events
      </button>
      <button
        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
          selectedTab === "blogs"
            ? "bg-white text-sky-700 shadow-sm border border-gray-100"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => onTabChange("blogs")}
      >
        <PenLine size={18} /> My Blogs
      </button>
      <button
        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
          selectedTab === "recommendations"
            ? "bg-white text-sky-700 shadow-sm border border-gray-100"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => onTabChange("recommendations")}
      >
        <PenLine size={18} /> My Recommendations
      </button>
    </div>
  );
};

export default TabSwitcher;
