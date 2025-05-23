import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Make sure useLocation is imported
import { getProjects, deleteProject } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');

    const { token } = useAuth();
    const location = useLocation(); // Get location object

    // Wrap fetchProjects in useCallback
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            // Consider if you want to clear feedback on every fetch, or only after specific actions
            // setFeedback(''); 
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch projects.');
            console.error("Fetch Projects Error:", err);
        } finally {
            setLoading(false);
        }
    }, []); // useCallback dependency array is empty if getProjects doesn't depend on props/state from this component

    useEffect(() => {
        fetchProjects();
        // If navigating back from add/edit with a success message, display it
        if (location.state?.message) {
            setFeedback(location.state.message);
            // Clear the message from location state so it doesn't reappear on unrelated re-renders
            // This requires navigating with replace: true if you want to modify history state.
            // For simplicity, we might just let it be or clear it after a timeout.
            // Or, more simply, the 'refresh' key itself changing is enough to trigger the fetch.
        }
    }, [fetchProjects, location.state?.refresh]); // Re-fetch if 'refresh' state changes

    const handleDeleteProject = async (projectId, projectTitle) => {
        if (window.confirm(`Are you sure you want to delete the project: "${projectTitle}"?`)) {
            try {
                setLoading(true); 
                setError('');
                setFeedback('');
                const response = await deleteProject(projectId, token);
                setFeedback(response.msg || 'Project deleted successfully!');
                fetchProjects(); 
            } catch (err) {
                setError(err.message || 'Failed to delete project.');
                console.error("Delete Project Error:", err);
                setLoading(false);
            }
        }
    };

    // Your JSX and styles from Response #137 can remain largely the same here
    // Just ensure the mapping of projects and button handlers are correct.
    const pageHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' };
    const buttonStyle = { padding: '10px 18px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '0.95rem', border: 'none', cursor: 'pointer' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
    const thStyle = { textAlign: 'left', padding: '12px', background: '#f0f0f0', borderBottom: '2px solid #ddd' };
    const tdStyle = { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'top' };
    const actionButtonStyle = { padding: '6px 12px', color: 'white', textDecoration: 'none', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginRight: '5px' };
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    if (loading && projects.length === 0) return <p>Loading projects...</p>;
    // Display error only if no projects are loaded yet. If projects are loaded, display error above table.
    if (error && projects.length === 0) return <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error fetching projects: {error}</p>;

    return (
        <div>
            <div style={pageHeaderStyle}>
                <h2>Projects Management</h2>
                <Link to="/admin/projects/new" style={buttonStyle}>
                    + Add New Project
                </Link>
            </div>

            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Action Error: {error}</p>}
            {feedback && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{feedback}</p>}
            {/* Show a different loading message if it's a refresh vs initial load */}
            {loading && projects.length > 0 && <p>Refreshing list...</p>}


            {projects.length === 0 && !loading && !error ? (
                <p>No projects found. Click "Add New Project" to get started!</p>
            ) : (
                projects.length > 0 && ( // Only render table if there are projects
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Tags</th>
                                <th style={{ ...thStyle, textAlign: 'center', width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project._id}>
                                    <td style={tdStyle}>{project.title}</td>
                                    <td style={tdStyle}>{project.tags && project.tags.join(', ')}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <Link
                                            to={`/admin/projects/edit/${project._id}`}
                                            style={{ ...actionButtonStyle, background: '#3498db' }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProject(project._id, project.title)}
                                            style={{ ...actionButtonStyle, background: '#e74c3c' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
};

export default AdminProjectsPage;