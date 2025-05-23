import React from 'react';

// Import your existing public site components
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Blog from '../sections/Blog'; // <<< IMPORT YOUR NEW BLOG COMPONENT
import Contact from '../sections/Contact';

const PublicSiteLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Projects />
                <Blog />      {/* <<< ADD THE BLOG COMPONENT HERE */}
                <Contact />
            </main>
            <Footer />
        </>
    );
};

export default PublicSiteLayout;