import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Relative path from src/admin/pages/
import { getProjectById, updateProject } from '../../services/api'; // Relative path

const AdminEditProjectPage = () => {
    const { projectId } = useParams(); // Get projectId from URL parameters
    const { token } = useAuth();
    const navigate = useNavigate();

    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState(''); // Will be a comma-separated string in the form
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [order, setOrder] = useState(0);

    const [loading, setLoading] = useState(true); // For fetching initial data
    const [updating, setUpdating] = useState(false); // For update submission
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch project details when component mounts or projectId changes
    const fetchProjectDetails = useCallback(async () => {
        if (!projectId || !token) {
            setError("Project ID or token is missing.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await getProjectById(projectId, token); // Use token if route becomes protected
            setTitle(data.title || '');
            setDescription(data.description || '');
            setImageUrl(data.imageUrl || '');
            setTags(Array.isArray(data.tags) ? data.tags.join(', ') : ''); // Join tags array into string
            setLiveLink(data.liveLink || '');
            setGithubLink(data.githubLink || '');
            setOrder(data.order !== undefined ? data.order : 0);
        } catch (err) {
            setError(err.message || 'Failed to fetch project details.');
            console.error("Fetch project details error:", err);
        } finally {
            setLoading(false);
        }
    }, [projectId, token]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        const updatedProjectData = {
            title,
            description,
            imageUrl,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert string to array
            liveLink,
            githubLink,
            order: Number(order) || 0,
        };

        try {
            const updated = await updateProject(projectId, updatedProjectData, token);
            setSuccess(`Project "${updated.title}" updated successfully!`);
            setTimeout(() => {
                navigate('/admin/projects', { state: { refresh: Date.now() } }); // Navigate back and trigger refresh
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to update project.');
            console.error("Update project error:", err);
        } finally {
            setUpdating(false);
        }
    };

    // Basic inline styles (can be replaced with Tailwind later)
    const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
    const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    const buttonContainerStyle = { marginTop: '20px', display: 'flex', gap: '10px' };
    const buttonStyle = { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' };
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    if (loading) return <p style={{textAlign: 'center', marginTop: '20px'}}>Loading project details...</p>;
    // Show form even if there was an initial fetch error, so user can see the error message
    // if (!project && !loading) return <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error || 'Project not found.'}</p>;


    return (
        <div style={formStyle}>
            <h2>Edit Project: {title || 'Loading...'}</h2>
            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error}</p>}
            {success && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div style={inputGroupStyle}>
                    <label htmlFor="title" style={labelStyle}>Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="description" style={labelStyle}>Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: '100px'}} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="imageUrl" style={labelStyle}>Image URL:</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/image.png"/>
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="tags" style={labelStyle}>Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} placeholder="e.g., react, nodejs, api"/>
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="liveLink" style={labelStyle}>Live Link URL:</label>
                    <input type="url" id="liveLink" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} style={inputStyle} placeholder="https://project-live-demo.com"/>
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="githubLink" style={labelStyle}>GitHub Link URL:</label>
                    <input type="url" id="githubLink" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} style={inputStyle} placeholder="https://github.com/yourusername/project"/>
                </div>
                 <div style={inputGroupStyle}>
                    <label htmlFor="order" style={labelStyle}>Order:</label>
                    <input type="number" id="order" value={order} onChange={(e) => setOrder(e.target.value === '' ? '' : parseInt(e.target.value, 10))} style={inputStyle} />
                </div>
                <div style={buttonContainerStyle}>
                    <button type="submit" disabled={updating} style={{ ...buttonStyle, backgroundColor: '#3498db', color: 'white' }}>
                        {updating ? 'Updating...' : 'Update Project'}
                    </button>
                    <Link to="/admin/projects" style={{ ...buttonStyle, backgroundColor: '#bdc3c7', color: '#2c3e50', textDecoration:'none', textAlign:'center' }}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminEditProjectPage;