import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAdminBlogPosts, deleteBlogPost } from '../../services/api'; // Ensure deleteBlogPost is imported
import { useAuth } from '../../contexts/AuthContext';

const AdminBlogPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(''); // For success/error messages

    const { token } = useAuth();
    const location = useLocation();

    const fetchPosts = useCallback(async () => {
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError('');
            // No need to clear feedback here, let it persist from add/edit/delete actions until next fetch
            const data = await getAdminBlogPosts(token);
            setPosts(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch blog posts.');
            console.error("Fetch Blog Posts Error:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPosts();
        if (location.state?.message) {
            setFeedback(location.state.message);
            // Clear the message from location state after displaying it
            // navigate(location.pathname, { replace: true, state: {} }); // Optional: if you want to clear it
        }
    }, [fetchPosts, location.state?.refresh, location.state?.message]);

    const handleDeletePost = async (postId, postTitle) => {
        if (window.confirm(`Are you sure you want to delete the blog post: "${postTitle}"? This action cannot be undone.`)) {
            try {
                setLoading(true); // Indicate an action is in progress
                setError('');
                setFeedback('');
                
                const response = await deleteBlogPost(postId, token); // Call the API function
                
                setFeedback(response.msg || 'Blog post deleted successfully!');
                
                // To update the list, you can either filter out the deleted post
                // or refetch all posts. Refetching is simpler for now.
                fetchPosts(); 
                // If you want to filter locally for quicker UI update:
                // setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

            } catch (err) {
                setError(err.message || 'Failed to delete blog post.');
                console.error("Delete Blog Post Error:", err);
                setLoading(false); // Ensure loading is reset on error
            }
            // setLoading(false) will be handled by fetchPosts in the success case if refetching
            // If filtering locally, uncomment the setLoading(false) here too.
        }
    };

    // ... (styles and initial loading/error JSX remain the same as in Response #162) ...
    const pageHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' };
    const buttonStyle = { padding: '10px 18px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '0.95rem', border: 'none', cursor: 'pointer' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
    const thStyle = { textAlign: 'left', padding: '12px', background: '#f0f0f0', borderBottom: '2px solid #ddd' };
    const tdStyle = { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'top' };
    const actionButtonStyle = { padding: '6px 12px', color: 'white', textDecoration: 'none', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', marginRight: '5px' };
    const messageStyle = { padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' };

    if (loading && posts.length === 0) return <p>Loading blog posts...</p>;
    if (error && posts.length === 0) return <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error fetching posts: {error}</p>;


    return (
        <div>
            <div style={pageHeaderStyle}>
                <h2>Manage Blog Posts</h2>
                <Link to="/admin/blog/new" style={buttonStyle}>
                    + Add New Blog Post
                </Link>
            </div>

            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Action Error: {error}</p>}
            {feedback && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{feedback}</p>}
            {loading && posts.length > 0 && <p>Processing...</p>}


            {posts.length === 0 && !loading && !error ? (
                <p>No blog posts found. Click "Add New Blog Post" to create one!</p>
            ) : (
                posts.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Created At</th>
                                <th style={{ ...thStyle, textAlign: 'center', width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id}>
                                    <td style={tdStyle}>{post.title}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '3px 8px', 
                                            borderRadius: '12px',
                                            color: 'white', 
                                            fontSize: '0.75em',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            backgroundColor: post.status === 'published' ? '#27ae60' : (post.status === 'draft' ? '#f39c12' : '#7f8c8d')
                                        }}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <Link
                                            to={`/admin/blog/edit/${post._id}`}
                                            style={{ ...actionButtonStyle, background: '#3498db' }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeletePost(post._id, post.title)}
                                            style={{ ...actionButtonStyle, background: '#e74c3c' }}
                                            disabled={loading} // Disable button while another action is processing
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

export default AdminBlogPostsPage;