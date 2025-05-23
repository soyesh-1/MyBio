import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createProject } from '../../services/api';

const AdminAddProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [order, setOrder] = useState(0);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const projectData = {
            title,
            description,
            imageUrl,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            liveLink,
            githubLink,
            order: Number(order) || 0,
        };

        try {
            const newProject = await createProject(projectData, token);
            setSuccess(`Project "${newProject.title}" created successfully!`);
            // Clear form fields after successful submission (optional)
            // setTitle(''); 
            // setDescription(''); 
            // setImageUrl(''); 
            // setTags(''); 
            // setLiveLink(''); 
            // setGithubLink(''); 
            // setOrder(0);
            setTimeout(() => {
                // Pass a 'refresh' state when navigating back
                navigate('/admin/projects', { state: { refresh: Date.now() } }); // <<< THIS LINE IS UPDATED
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create project.');
            console.error("Create project error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // ... your JSX for the form and styles remain exactly the same ...
    const formStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
    const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
    const buttonStyle = { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' };
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    return (
        <div style={formStyle}>
            <h2>Add New Project</h2>
            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error}</p>}
            {success && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={inputGroupStyle}>
                    <label htmlFor="title" style={labelStyle}>Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                {/* Description */}
                <div style={inputGroupStyle}>
                    <label htmlFor="description" style={labelStyle}>Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{...inputStyle, minHeight: '100px'}} />
                </div>
                {/* Image URL */}
                <div style={inputGroupStyle}>
                    <label htmlFor="imageUrl" style={labelStyle}>Image URL:</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/image.png" />
                </div>
                {/* Tags */}
                <div style={inputGroupStyle}>
                    <label htmlFor="tags" style={labelStyle}>Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} placeholder="e.g., react, nodejs, api" />
                </div>
                {/* Live Link */}
                <div style={inputGroupStyle}>
                    <label htmlFor="liveLink" style={labelStyle}>Live Link URL:</label>
                    <input type="url" id="liveLink" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} style={inputStyle} placeholder="https://project-live-demo.com" />
                </div>
                {/* GitHub Link */}
                <div style={inputGroupStyle}>
                    <label htmlFor="githubLink" style={labelStyle}>GitHub Link URL:</label>
                    <input type="url" id="githubLink" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} style={inputStyle} placeholder="https://github.com/yourusername/project" />
                </div>
                {/* Order */}
                 <div style={inputGroupStyle}>
                    <label htmlFor="order" style={labelStyle}>Order (0 for default):</label>
                    <input type="number" id="order" value={order} onChange={(e) => setOrder(e.target.value === '' ? '' : parseInt(e.target.value, 10))} style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Creating Project...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
};

export default AdminAddProjectPage;