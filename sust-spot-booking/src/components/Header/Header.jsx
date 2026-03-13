import sustLogo from '../../assets/sust_logo.png'; // 1. Import the image
import { Link } from "react-router-dom";

const Header = ({ onLogout, onOpenNotif, role }) => {
  return (
    <header className="sticky top-0 z-50 bg-sky-400 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 min-h-[70px]">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <img
            src={sustLogo} // 2. Use the variable here instead of a string
            alt="SUST Logo"
            className="w-9 h-9"
          />
          <span className="text-white font-bold text-lg">
            SUST Spot Booking
          </span>
        </div>

        {/* Center Navigation (hidden on small screens) */}
        {
          <nav className="hidden md:flex gap-7 text-white font-medium items-center">
            {/* Change Link to a Button for the Modal trigger */}
            <button 
            onClick={onOpenNotif} 
            className="hover:underline flex items-center gap-1"
          >
            Notifications
            <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded-full">3</span>
          </button>

            {role === 'user' && (
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          )}
          </nav>
        }

        <button
          onClick={onLogout}
          className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
