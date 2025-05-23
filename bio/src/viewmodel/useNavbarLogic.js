import { useState, useEffect } from 'react';

export const useNavbarLogic = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (sectionIdWithHash) => {
        const idToScroll = sectionIdWithHash.startsWith('#') ? sectionIdWithHash.substring(1) : sectionIdWithHash;
        const section = document.getElementById(idToScroll);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleGlobalAnchorClick = (event) => {
            const anchor = event.target.closest('a[href^="#"]');
            if (anchor) {
                const targetId = anchor.getAttribute('href');
                if (targetId && targetId !== "#" && targetId.length > 1) {
                    event.preventDefault();
                    scrollToSection(targetId);
                } else if (targetId === "#") {
                    event.preventDefault();
                }
            }
        };

        document.addEventListener('click', handleGlobalAnchorClick);
        return () => {
            document.removeEventListener('click', handleGlobalAnchorClick);
        };
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    return {
        isMobileMenuOpen,
        toggleMobileMenu,
    };
};