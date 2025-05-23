import React, { useState, useEffect, useCallback } from 'react';
import Section from '../components/UI/Section';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import { getProjects } from '../services/api';
import { useSiteData } from '../viewmodel/useSiteData';

const Projects = () => {
    const [projectsFromAPI, setProjectsFromAPI] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { projectsContent } = useSiteData();

    const fetchPublicProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getProjects();
            setProjectsFromAPI(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch projects.');
            console.error("Fetch Public Projects Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPublicProjects();
    }, [fetchPublicProjects]);

    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    return (
        <Section
            id="projects"
            title={projectsContent.title || "My Projects"}
            bgColor="bg-gray-100"  // <<< CHANGED BACK to light gray background
            titleColor="text-black" // <<< Title color for light background
            dividerColor="bg-black" // <<< Divider color for light background
            textColor="text-gray-700" // <<< Default text color for light background
        >
            {loading && <p className="text-center text-gray-700">Loading projects...</p>}
            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }} className="text-center">Error: {error}</p>}
            
            {!loading && !error && projectsFromAPI.length === 0 && (
                <p className="text-center text-gray-700">No projects to display at the moment. Check back soon!</p>
            )}

            {!loading && !error && projectsFromAPI.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {projectsFromAPI.map(project => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </Section>
    );
};

export default Projects;