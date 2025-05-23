import React from 'react';
import { useSiteData } from '../../viewmodel/useSiteData';
import { useNavbarLogic } from '../../viewmodel/useNavbarLogic';
import menuIconSrc from '../../assets/icons/menu-icon.svg';
import closeIconSrc from '../../assets/icons/close-icon.svg';

const Navbar = () => {
    const { navbarContent } = useSiteData();
    const { isMobileMenuOpen, toggleMobileMenu } = useNavbarLogic();

    return (
        <nav className="bg-black shadow-md fixed w-full z-50 top-0">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href={navbarContent.links.find(l => l.id === 'home')?.href || "#home"} className="text-2xl font-bold text-white">
                    {navbarContent.brandName}
                </a>
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-1"
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <img
                            src={isMobileMenuOpen ? closeIconSrc : menuIconSrc}
                            alt={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            className="w-6 h-6"
                        />
                    </button>
                </div>
                <div className="hidden md:flex space-x-4">
                    {navbarContent.links.map(link => (
                        <a
                            key={link.id}
                            href={link.href}
                            className="text-gray-300 hover:text-white transition duration-300"
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black shadow-lg absolute w-full">
                    {navbarContent.links.map(link => (
                        <a
                            key={link.id}
                            href={link.href}
                            className="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition duration-300"
                        >
                            {link.text}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};
export default Navbar;