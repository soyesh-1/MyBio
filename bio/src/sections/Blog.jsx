import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Still useful for text-based posts
import Section from '../components/UI/Section';
import { getPublicBlogPosts } from '../services/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const sectionTitle = "Blogs"; // Or "Latest Media & Thoughts"

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true); setError('');
            const data = await getPublicBlogPosts();
            setPosts(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch blog posts.');
            console.error("Fetch Public Blog Posts Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };
    
    const postItemStyle = {
        background: '#ffffff', padding: '20px', borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '20px',
        border: '1px solid #e2e8f0'
    };
    const mediaLinkStyle = { display: 'block', textDecoration: 'none', color: 'inherit' };

    return (
        <Section id="blog" title={sectionTitle} bgColor="bg-white" textColor="text-gray-800" titleColor="text-black" dividerColor="bg-black">
            {loading && <p className="text-center text-gray-600">Loading posts...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">Error: {error}</p>}

            {!loading && !error && posts.length === 0 && (
                <p className="text-center text-gray-600">No posts available yet. Check back soon!</p>
            )}

            {!loading && !error && posts.length > 0 && (
                <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3"> {/* Using grid for better layout */}
                    {posts.map(post => {
                        const isMediaPost = post.youtubeLink || post.spotifyLink;
                        const mediaUrl = post.youtubeLink || post.spotifyLink;

                        return (
                            <article key={post._id} style={postItemStyle} className="transition-shadow duration-300 hover:shadow-xl flex flex-col">
                                {isMediaPost && post.featuredImageUrl && (
                                    <a href={mediaUrl} target="_blank" rel="noopener noreferrer" style={mediaLinkStyle}>
                                        <img 
                                            src={post.featuredImageUrl} 
                                            alt={`${post.title || 'Media thumbnail'} cover`} 
                                            className="w-full h-48 object-cover rounded-t-md mb-3" 
                                        />
                                    </a>
                                )}
                                {!isMediaPost && post.featuredImageUrl && ( // For regular blog posts with a featured image
                                     <Link to={`/blog/${post.slug}`}>
                                        <img 
                                            src={post.featuredImageUrl} 
                                            alt={`${post.title || 'Blog post'} cover`} 
                                            className="w-full h-48 object-cover rounded-t-md mb-3" 
                                        />
                                     </Link>
                                )}
                                
                                <div className="flex flex-col flex-grow p-1"> {/* Added padding to content area of card */}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {isMediaPost ? (
                                            <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700 transition-colors">
                                                {post.title || 'Featured Media'}
                                            </a>
                                        ) : (
                                            <Link to={`/blog/${post.slug}`} className="hover:text-indigo-700 transition-colors">
                                                {post.title || 'Untitled Post'}
                                            </Link>
                                        )}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3">
                                        {post.status === 'published' && post.publishedAt ? `Published on ${formatDate(post.publishedAt)}` : `Created on ${formatDate(post.createdAt)}`}
                                        {post.author && <span className="italic"> by {post.author}</span>}
                                    </p>
                                    {(post.summary || (!isMediaPost && post.content)) && (
                                        <p className="text-gray-700 leading-relaxed mb-4 text-sm flex-grow">
                                            {post.summary || `${post.content.substring(0, 100)}...`} {/* Show summary or snippet of content */}
                                        </p>
                                    )}
                                    {!isMediaPost && ( // Only show "Read more" for non-media posts or if there's more content
                                        <Link
                                            to={`/blog/${post.slug}`}
                                            className="inline-block mt-auto text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline"
                                        >
                                            Read more &rarr;
                                        </Link>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </Section>
    );
};

export default Blog;