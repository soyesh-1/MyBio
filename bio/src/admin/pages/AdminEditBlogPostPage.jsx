import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBlogPostByIdAdmin, updateBlogPost } from '../../services/api';

const AdminEditBlogPostPage = () => {
    const { postId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('draft');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [spotifyLink, setSpotifyLink] = useState('');
    const [order, setOrder] = useState(0); // <<< ADD order state

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const [originalSlug, setOriginalSlug] = useState(''); // We might not need this if backend handles slug logic well

    const fetchPostDetails = useCallback(async () => {
        if (!postId || !token) {
            setError("Post ID or authentication token is missing.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await getBlogPostByIdAdmin(postId, token);
            setTitle(data.title || '');
            setSlug(data.slug || '');
            // setOriginalSlug(data.slug || '');
            setSummary(data.summary || '');
            setContent(data.content || '');
            setFeaturedImageUrl(data.featuredImageUrl || '');
            setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
            setStatus(data.status || 'draft');
            setYoutubeLink(data.youtubeLink || '');
            setSpotifyLink(data.spotifyLink || '');
            setOrder(data.order !== undefined ? data.order : 0); // <<< POPULATE order state
        } catch (err) {
            setError(err.message || 'Failed to fetch blog post details.');
            console.error("Fetch blog post details error:", err);
        } finally {
            setLoading(false);
        }
    }, [postId, token]);

    useEffect(() => {
        fetchPostDetails();
    }, [fetchPostDetails]);

    const handleSlugChange = (e) => {
        const rawSlug = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        setSlug(rawSlug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        if (!slug) {
            setError('Slug is required and cannot be empty.');
            setUpdating(false);
            return;
        }

        const postData = { // Renamed from updatedProjectData for clarity
            title,
            slug,
            summary,
            content,
            featuredImageUrl,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            status,
            youtubeLink,
            spotifyLink,
            order: Number(order) || 0, // <<< ADD order to payload
        };

        try {
            const updatedPost = await updateBlogPost(postId, postData, token);
            setSuccess(`Blog post "${updatedPost.title}" updated successfully!`);
            setTimeout(() => {
                navigate('/admin/blog', { state: { refresh: Date.now(), message: `Post "${updatedPost.title}" updated!` } });
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to update blog post.');
            console.error("Update blog post error:", err);
        } finally {
            setUpdating(false);
        }
    };

    // ... (styles remain the same as in Response #166) ...
    const formStyle = { maxWidth: '700px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputGroupStyle = { marginBottom: '15px' };
    const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
    const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.95rem' };
    const textAreaStyle = { ...inputStyle, minHeight: '200px', fontFamily: 'inherit' };
    const selectStyle = { ...inputStyle };
    const buttonContainerStyle = { marginTop: '20px', display: 'flex', gap: '10px' };
    const buttonStyle = { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }; // Removed marginRight here
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    if (loading) return <p style={{textAlign: 'center', marginTop: '20px'}}>Loading blog post details...</p>;
    // Show main error if title didn't load (implies major issue with fetch)
    if (error && !title && !success) return <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error loading details: {error}</p>;


    return (
        <div style={formStyle}>
            <h2>Edit Blog Post</h2>
            <p style={{marginBottom: '15px', fontSize: '0.9em', color: '#555'}}>Editing: {title || 'Post'}</p>
            {error && !success && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Update Error: {error}</p>}
            {success && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                {/* Title, Slug, Summary, Content, Featured Image, YouTube, Spotify, Tags, Status inputs as before */}
                <div style={inputGroupStyle}>
                    <label htmlFor="title" style={labelStyle}>Title:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="slug" style={labelStyle}>Slug (URL-friendly):</label>
                    <input type="text" id="slug" value={slug} onChange={handleSlugChange} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="summary" style={labelStyle}>Summary (Optional):</label>
                    <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} style={{...inputStyle, minHeight: '80px'}} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="content" style={labelStyle}>Content:</label>
                    <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required style={textAreaStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="featuredImageUrl" style={labelStyle}>Featured Image URL (Optional):</label>
                    <input type="url" id="featuredImageUrl" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="youtubeLink" style={labelStyle}>YouTube Video Link (Optional):</label>
                    <input type="url" id="youtubeLink" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="spotifyLink" style={labelStyle}>Spotify Playlist/Track Link (Optional):</label>
                    <input type="url" id="spotifyLink" value={spotifyLink} onChange={(e) => setSpotifyLink(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="tags" style={labelStyle}>Tags (comma-separated, Optional):</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
                </div>
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
                
                <div style={buttonContainerStyle}>
                    <button type="submit" disabled={updating} style={{ ...buttonStyle, backgroundColor: '#3498db', color: 'white', marginRight: '10px' }}>
                        {updating ? 'Updating Post...' : 'Update Blog Post'}
                    </button>
                    <Link to="/admin/blog" style={{ ...buttonStyle, backgroundColor: '#bdc3c7', color: '#2c3e50', textDecoration:'none', textAlign:'center' }}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default AdminEditBlogPostPage;