import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createBlogPost } from '../../services/api';

const AdminAddBlogPostPage = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('draft');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [spotifyLink, setSpotifyLink] = useState('');
    const [order, setOrder] = useState(0); // <<< ADD order state, default to 0

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSlugChange = (e) => {
        const rawSlug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        setSlug(rawSlug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (setError, setSuccess, setLoading logic as before) ...
        setError(''); setSuccess(''); setLoading(true);

        let currentSlug = slug;
        if (!currentSlug && title) {
             currentSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
             // No need to setSlug here if we use currentSlug in postData directly
        }
        if (!currentSlug) {
            setError('Slug is required or could not be auto-generated from title. Please enter a slug.');
            setLoading(false);
            return;
        }

        const postData = {
            title, slug: currentSlug, summary, content, featuredImageUrl,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            status, youtubeLink, spotifyLink,
            order: Number(order) || 0, // <<< ADD order to payload
        };

        try {
            const newPost = await createBlogPost(postData, token);
            setSuccess(`Blog post "${newPost.title}" created successfully as ${newPost.status}!`);
            // Clear form
            setTitle(''); setSlug(''); setSummary(''); setContent('');
            setFeaturedImageUrl(''); setTags(''); setStatus('draft');
            setYoutubeLink(''); setSpotifyLink(''); setOrder(0); // Clear order

            setTimeout(() => {
                navigate('/admin/blog', { state: { refresh: Date.now(), message: `Post "${newPost.title}" created!` } });
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create blog post.');
            console.error("Create blog post error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // ... (styles remain the same) ...
    const formStyle = { maxWidth: '700px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
    const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.95rem' };
    const textAreaStyle = { ...inputStyle, minHeight: '200px', fontFamily: 'inherit' };
    const selectStyle = { ...inputStyle };
    const buttonStyle = { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' };
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    return (
        <div style={formStyle}>
            <h2>Add New Blog Post</h2>
            {/* ... (error and success messages) ... */}
            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error}</p>}
            {success && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* ... (title, slug, summary, content, featuredImageUrl, youtubeLink, spotifyLink, tags inputs as before) ... */}
                 <div style={inputGroupStyle}>
                    <label htmlFor="title" style={labelStyle}>Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="slug" style={labelStyle}>Slug:</label>
                    <input type="text" id="slug" value={slug} onChange={handleSlugChange} style={inputStyle} placeholder="Leave blank to auto-generate from title"/>
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="summary" style={labelStyle}>Summary:</label>
                    <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{...inputStyle, minHeight: '80px'}} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="content" style={labelStyle}>Content:</label>
                    <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required style={textAreaStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="featuredImageUrl" style={labelStyle}>Featured Image URL:</label>
                    <input type="url" id="featuredImageUrl" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/image.png"/>
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="youtubeLink" style={labelStyle}>YouTube Link:</label>
                    <input type="url" id="youtubeLink" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="spotifyLink" style={labelStyle}>Spotify Link:</label>
                    <input type="url" id="spotifyLink" value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="tags" style={labelStyle}>Tags (comma-separated):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
                </div>
                {/* Status dropdown */}
                <div style={inputGroupStyle}>
                    <label htmlFor="status" style={labelStyle}>Status:</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                {/* <<< NEW ORDER FIELD >>> */}
                <div style={inputGroupStyle}>
                    <label htmlFor="order" style={labelStyle}>Display Order (e.g., 0, 1, 2... lower numbers appear first):</label>
                    <input 
                        type="number" 
                        id="order" 
                        value={order} 
                        onChange={(e) => setOrder(e.target.value === '' ? 0 : parseInt(e.target.value, 10))} 
                        style={inputStyle} 
                    />
                </div>
                {/* <<< END NEW ORDER FIELD >>> */}
                
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Creating Post...' : 'Create Blog Post'}
                </button>
            </form>
        </div>
    );
};

export default AdminAddBlogPostPage;