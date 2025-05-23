import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed

const AdminDashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [welcomeVisible, setWelcomeVisible] = useState(false);
    const [nameVisible, setNameVisible] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setWelcomeVisible(true), 200);
        const timer2 = setTimeout(() => setNameVisible(true), 600);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Style for the main navigation buttons (Projects, Blog, CV)
    const heroLikeButtonStyle = "bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-all duration-300 ease-in-out text-md sm:text-lg transform hover:scale-105 w-full sm:w-auto text-center";
    
    // Style for the top-left "Manage Profile" button (hero-like but sized as a utility)
    const topLeftProfileButtonStyle = "bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg hover:bg-white hover:text-black transition-all duration-300 ease-in-out text-sm transform hover:scale-105 text-center";

    // Style for top-right utility buttons (View Site, Logout)
    const utilityButtonStyle = "py-2 px-4 text-sm rounded-md transition-colors duration-200 shadow-md";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 sm:p-6 relative">
            
            {/* Top-Left Profile Button with Hero-Like Style */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
                <Link 
                    to="/admin/profile"
                    className={topLeftProfileButtonStyle}
                >
                    Manage Profile
                </Link>
            </div>

            {/* Top-Right View Site & Logout Buttons */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-3 z-10">
                <Link 
                    to="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${utilityButtonStyle} bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white`}
                >
                    View Site
                </Link>
                <button 
                    onClick={handleLogout}
                    className={`${utilityButtonStyle} bg-red-600 hover:bg-red-500 text-white`}
                >
                    Logout
                </button>
            </div>
            
            <div className="text-center mb-8 md:mb-10 mt-20 sm:mt-16 md:mt-24"> {/* Increased top margin slightly more */}
                <h1 
                    className={`text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-100 leading-tight transition-all duration-700 ease-out transform ${
                        welcomeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                >
                    Welcome
                </h1>
                <h2 
                    className={`text-6xl sm:text-7xl md:text-8xl font-bold text-white mt-1 sm:mt-2 transition-all duration-700 ease-out transform ${
                        nameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: nameVisible ? '0ms' : '400ms' }}
                >
                    ShowAss 
                </h2>
            </div>

            {user && (
                <p className="text-lg sm:text-xl text-gray-400 mb-8 md:mb-10">
                    Logged in as: <strong className="text-gray-200">{user.username || 'Admin'}</strong>
                </p>
            )}

            <p className="text-lg text-gray-300 mb-6 sm:mb-8">
                Manage your website content:
            </p>

            {/* Main Navigation Buttons (Projects, Blog, CV) - Centered Row */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-xl md:max-w-2xl">
                <Link to="/admin/projects" className={heroLikeButtonStyle}>
                    Manage Projects
                </Link>
                <Link to="/admin/blog" className={heroLikeButtonStyle}>
                    Manage Blog
                </Link>
                <Link to="/admin/cv" className={heroLikeButtonStyle}>
                    Manage CV
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;