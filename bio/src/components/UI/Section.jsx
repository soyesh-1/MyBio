import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const Section = ({ id, title, children, bgColor = "bg-white", titleColor = "text-black", dividerColor = "bg-black", textColor = "text-gray-700" }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = entry?.isIntersecting;

    return (
        <section
            id={id}
            ref={ref}
            className={`py-16 md:py-24 ${bgColor} transition-opacity duration-700 ease-in-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="container mx-auto px-6">
                {title && (
                    <>
                        <h2 className={`text-3xl md:text-4xl font-bold text-center ${titleColor} mb-4`}>{title}</h2>
                        <div className={`w-20 h-1 ${dividerColor} mx-auto mb-12 rounded`}></div>
                    </>
                )}
                <div className={textColor}>
                    {children}
                </div>
            </div>
        </section>
    );
};
export default Section;