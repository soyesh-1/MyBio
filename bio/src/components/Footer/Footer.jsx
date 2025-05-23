import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../viewmodel/useSiteData';

const Footer = () => {
    const { footerContent } = useSiteData();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="bg-black text-gray-400 py-8">
            <div className="container mx-auto px-6 text-center">
                <p>&copy; {currentYear} {footerContent.copyrightName}. All rights reserved.</p>
                <p className="text-sm mt-1">
                </p>
            </div>
        </footer>
    );
};
export default Footer;