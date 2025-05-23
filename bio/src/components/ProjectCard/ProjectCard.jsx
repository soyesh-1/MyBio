import React from 'react';

// Corrected Icon Imports
import { DiReact, DiNodejsSmall } from 'react-icons/di'; // Devicons
import { 
    SiFlutter, 
    SiJavascript, 
    SiPython, 
    SiMongodb, 
    SiExpress, 
    SiTailwindcss, 
    SiVuedotjs, 
    SiFirebase, 
    SiNextdotjs, 
    SiGraphql 
} from 'react-icons/si'; // Simple Icons

// Helper function to get the icon based on the tag
// This function should be defined in the module scope, outside the ProjectCard component
const getTechIcon = (tag) => {
    const lowerTag = tag.toLowerCase().replace(/\s/g, ''); // Normalize tag: lowercase, remove spaces
    
    if (lowerTag.includes('react')) return <DiReact size="1.2em" className="inline mr-1 text-blue-500" aria-label="React icon" />;
    if (lowerTag.includes('node') || lowerTag.includes('nodejs')) return <DiNodejsSmall size="1.2em" className="inline mr-1 text-green-500" aria-label="Node.js icon" />;
    if (lowerTag.includes('flutter')) return <SiFlutter size="1.2em" className="inline mr-1 text-blue-400" aria-label="Flutter icon" />;
    if (lowerTag.includes('javascript') || lowerTag.includes('js')) return <SiJavascript size="1.1em" className="inline mr-1 text-yellow-400 rounded-sm" aria-label="JavaScript icon" />; // Added rounded-sm for JS icon squareness
    if (lowerTag.includes('python')) return <SiPython size="1.1em" className="inline mr-1 text-blue-400" aria-label="Python icon" />;
    if (lowerTag.includes('mongodb')) return <SiMongodb size="1.1em" className="inline mr-1 text-green-500" aria-label="MongoDB icon" />;
    if (lowerTag.includes('express')) return <SiExpress size="1.1em" className="inline mr-1 text-gray-700" aria-label="Express.js icon" />;
    if (lowerTag.includes('tailwind')) return <SiTailwindcss size="1.1em" className="inline mr-1 text-teal-500" aria-label="Tailwind CSS icon" />;
    if (lowerTag.includes('vue') || lowerTag.includes('vuejs')) return <SiVuedotjs size="1.1em" className="inline mr-1 text-green-400" aria-label="Vue.js icon" />;
    if (lowerTag.includes('firebase')) return <SiFirebase size="1.1em" className="inline mr-1 text-yellow-500" aria-label="Firebase icon" />;
    if (lowerTag.includes('nextjs') || lowerTag.includes('next.js')) return <SiNextdotjs size="1.1em" className="inline mr-1 text-black" aria-label="Next.js icon" />;
    if (lowerTag.includes('graphql')) return <SiGraphql size="1.1em" className="inline mr-1 text-pink-500" aria-label="GraphQL icon" />;
    
    return null; // No specific icon for this tag
};

const ProjectCard = ({ project }) => {
    if (!project) {
        return null; // Or some placeholder if a project object is missing
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col border border-gray-200">
            {project.imageUrl && (
                 <img 
                     src={project.imageUrl}
                     alt={`${project.title || 'Project'} Thumbnail`}
                     className="w-full h-56 object-cover rounded-t-xl" // Image has rounded top corners
                     onError={(e) => { 
                         e.target.onerror = null; 
                         e.target.alt = "Image not found"; 
                         e.target.src="https://placehold.co/600x400/E5E7EB/9CA3AF?text=Image+Missing"; 
                     }}
                />
            )}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-2">{project.title || 'Project Title'}</h3> {/* Adjusted heading size slightly */}
                <p className="text-gray-600 leading-relaxed mb-4 flex-grow text-sm">
                    {project.description || 'Project description goes here.'}
                </p>
                
                {project.tags && project.tags.length > 0 && (
                    <div className="mt-auto mb-3 flex flex-wrap items-center"> {/* mt-auto pushes this block down */}
                        {project.tags.map(tag => {
                            const iconComponent = getTechIcon(tag); // Call the helper function
                            return (
                                <span 
                                    key={tag} 
                                    className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full shadow-sm transition-colors duration-150"
                                >
                                    {iconComponent} {/* Render the icon component */}
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-4"> {/* Added border-t for clear separation */}
                    {project.liveLink && project.liveLink !== "#" && (
                        <a 
                            href={project.liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                        >
                            Live Demo
                        </a>
                    )}
                    {project.githubLink && project.githubLink !== "#" && (
                        <a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
                        >
                            GitHub
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;