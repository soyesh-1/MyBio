import React from 'react';
import Section from '../components/UI/Section';
import { useSiteData } from '../viewmodel/useSiteData';

// Import icons from react-icons (you can choose different sets like Fa, Si, Ai etc.)
// Fa for Font Awesome, Si for Simple Icons are good choices
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaTwitter, FaDiscord } from 'react-icons/fa'; 
// Example: Using Font Awesome icons. If you prefer other styles, import from appropriate set.

// Helper function or object to map iconKey to actual icon component
const iconMap = {
    discord: <FaDiscord />,
    linkedin: <FaLinkedin />,
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    twitter: <FaTwitter />
    // Add more mappings here if you add more iconKeys in siteContent.js
};

const Contact = () => {
    const { contactContent } = useSiteData();

    return (
        <Section 
            id="contact" 
            title={contactContent.title || "Get In Touch"}
            // Using default Section component styles (white background)
        >
            <p className="text-lg text-gray-700 max-w-2xl mx-auto text-center leading-relaxed mb-8">
                {contactContent.pitch}
            </p>
            <div className="max-w-lg mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                        <a href={`mailto:${contactContent.email}`} className="hover:text-indigo-600 transition-colors">
                            {contactContent.email}
                        </a>
                    </p>
                    <p className="mt-6 mb-4 text-gray-600">Connect with me on social media:</p>
                    <div className="mt-4 flex justify-center space-x-5 sm:space-x-6">
                        {contactContent.socialLinks && contactContent.socialLinks.map(social => {
                            const IconComponent = iconMap[social.iconKey.toLowerCase()];
                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    aria-label={social.label || social.name}
                                    className="text-gray-500 hover:text-indigo-600 transition-transform duration-200 transform hover:scale-110"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.name} // Tooltip for the icon
                                >
                                    {IconComponent ? React.cloneElement(IconComponent, { size: 28 }) : social.name}
                                    {/* Render the icon component, or fallback to name if icon not found */}
                                    {/* Increased size to 28 for better visibility */}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Contact;