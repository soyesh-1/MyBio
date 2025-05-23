import React from 'react';
import Section from '../components/UI/Section';
import { useSiteData } from '../viewmodel/useSiteData';

const About = () => {
    const { aboutContent } = useSiteData();
    return (
        <Section id="about" title={aboutContent.title}>
            <p className="text-lg max-w-3xl mx-auto text-center leading-relaxed whitespace-pre-line">
                {aboutContent.description}
            </p>
        </Section>
    );
};
export default About;