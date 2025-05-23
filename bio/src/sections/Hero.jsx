import React, { useState, useEffect, useCallback } from 'react';
import { useSiteData } from '../viewmodel/useSiteData'; // Assuming path is correct
import { getCvInfo } from '../services/api';         // Assuming path is correct

const Hero = () => {
    const { heroContent } = useSiteData();
    const [cvData, setCvData] = useState(null);
    const [cvLoading, setCvLoading] = useState(true);

    const fetchCv = useCallback(async () => {
        try {
            setCvLoading(true);
            const data = await getCvInfo();
            setCvData(data);
        } catch (err) {
            console.error("Fetch CV Info for Hero error:", err);
            setCvData(null);
        } finally {
            setCvLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCv();
    }, [fetchCv]);

    const cvDownloadUrl = cvData && cvData.filePath
        ? `http://localhost:5001/${cvData.filePath.replace(/\\/g, '/')}`
        : null;

    // Define the common button classes for the "Get In Touch" style
    const coolButtonStyle = "bg-transparent border-2 border-white text-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 text-lg transform hover:scale-105";

    return (
        <section id="home" className="min-h-screen bg-black flex items-center pt-20 md:pt-0">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-200 leading-tight">
                            {heroContent.greeting} <span className="font-bold text-white">{heroContent.name}</span>
                        </h1>
                        <p className="mt-4 text-xl text-gray-400 font-normal tracking-wide">
                            {heroContent.tagline}
                        </p>
                        <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
                            {heroContent.description}
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-4">
                            {/* View My Work Button - Styled like "Get In Touch" */}
                            <a href={heroContent.ctaPrimary.href}
                               className={coolButtonStyle}>
                                {heroContent.ctaPrimary.text}
                            </a>

                            {/* Get In Touch Button - Already has the cool style */}
                            <a href={heroContent.ctaSecondary.href}
                               className={coolButtonStyle}>
                                {heroContent.ctaSecondary.text}
                            </a>

                            {/* CV Download Button - Styled like "Get In Touch" */}
                            {!cvLoading && cvDownloadUrl && (
                                <a
                                    href={cvDownloadUrl}
                                    download={cvData.originalName || 'resume.pdf'}
                                    className={coolButtonStyle}
                                >
                                    Download CV
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center items-center">
                        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-600">
                            <img
                                src={heroContent.imageUrl}
                                alt={`${heroContent.name} - Professional Headshot`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Hero;