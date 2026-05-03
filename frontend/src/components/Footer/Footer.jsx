

import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#0ea5e9] text-white"> {/* Main Sky Blue Background */}
            {/* Top Section with Back to Top */}
            <div className="border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <span className="text-sm font-medium tracking-widest text-sky-100 uppercase">
                        SUST Spot Booking System
                    </span>
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-sm hover:text-sky-200 transition-colors"
                    >
                        Back to Top <FaArrowUp size={12} />
                    </button>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: About */}
                <div>
                    <h3 className="text-white font-bold mb-4 text-lg">About the Platform</h3>
                    <p className="text-sm leading-relaxed text-sky-50">
                        A centralized system for students, faculty, and clubs of Shahjalal University of Science and Technology
                        to discover and reserve campus spots for events, seminars, and academic activities.
                    </p>
                </div>

                {/* Column 2: Navigation */}
                <div>
                    <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" className="text-sky-50 hover:text-white hover:underline transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/preferred-spots" className="text-sky-50 hover:text-white hover:underline transition-colors">
                                Explore Spots
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="text-sky-50 hover:text-white hover:underline transition-colors">
                                My Bookings
                            </Link>
                        </li>
                        <li>
                            <Link to="/featured-events" className="text-sky-50 hover:text-white hover:underline transition-colors">
                                Event Blogs
                            </Link>
                        </li>
                        <li>
                            <a href="/map" className="text-sky-50 hover:text-white hover:underline transition-colors">
                                Campus Map
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h3 className="text-white font-bold mb-4 text-lg">Contact Support</h3>
                    <ul className="space-y-2 text-sm text-sky-50">
                        <li>IICT Building, SUST</li>
                        <li>Sylhet-3114, Bangladesh</li>
                        <li>Email: <span className="text-white font-medium underline">support@sust.edu</span></li>
                        <li>Phone: +880-1234-567890</li>
                    </ul>
                </div>

                {/* Column 4: Social & Legal */}
                <div>
                    <h3 className="text-white font-bold mb-4 text-lg">Information</h3>
                    <ul className="text-xs space-y-1 opacity-80 text-sky-100">
                        <li>
                            <Link to="/info/guidelines" className="hover:underline">
                                Booking Guidelines
                            </Link>
                        </li>
                        <li>
                            <Link to="/info/terms" className="hover:underline">
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link to="/info/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="bg-[#0369a1] py-6 border-t border-white/10"> {/* Darker Blue Bar */}
                <div className="max-w-7xl mx-auto px-6 text-center text-xs tracking-wider text-sky-100 uppercase">
                    <p>
                        &copy; {new Date().getFullYear()} SUST Spot Booking.
                        Developed by <span className="text-white">Software Engineering Department, SUST</span>.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;