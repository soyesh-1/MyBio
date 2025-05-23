import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ensure path is correct

const AdminLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate('/admin/login');
    };

    return (
        <div>
            <header style={{ background: '#2c3e50', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', marginRight: '30px' }}>Admin Panel</h1>
                    <nav>
                        <Link to="/admin/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
                        <Link to="/admin/projects" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Projects</Link>
                        <Link to="/admin/blog" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Blog</Link> 
                         <Link to="/admin/cv" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Manage CV</Link>
                         <Link to="/admin/profile" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Profile/Headshot</Link> 
                        {/* Add link for CV management later */}
                    </nav>
                </div>
                <div>
                    <Link 
                        to="/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                            color: '#ecf0f1', 
                            marginRight: '20px', 
                            textDecoration: 'none', 
                            border: '1px solid #7f8c8d', 
                            padding: '6px 12px', 
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            transition: 'background-color 0.2s, color 0.2s'
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#34495e'; e.target.style.borderColor = '#34495e';}}
                        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = '#7f8c8d';}}
                    >
                        View Site
                    </Link>
                    {auth.isAuthenticated && (
                        <button 
                            onClick={handleLogout} 
                            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </header>
            <main style={{ padding: '20px', minHeight: 'calc(100vh - 120px)' }}>
                <Outlet />
            </main>
            <footer style={{ background: '#34495e', color: 'white', textAlign: 'center', padding: '1rem', marginTop: 'auto' }}>
                <p>&copy; {new Date().getFullYear()} Admin Panel</p>
            </footer>
        </div>
    );
};

export default AdminLayout;