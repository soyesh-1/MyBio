import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if your contexts folder is different
import { loginAdmin } from '../../services/api';     // Adjust path if your services folder is different

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine where to redirect after login
    // If 'location.state.from' exists, it means user was redirected to login from a protected page
    // Otherwise, default to '/admin/dashboard'
    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginAdmin(username, password); // Calls your backend API
            
            // The 'data' object from your backend should contain the token
            // e.g., data = { token: "eyJ..." }
            // The token itself usually contains user info in its payload.
            // Let's decode the username from the token for the AuthContext for now.
            // For a production app, use a proper JWT decoding library.
            let userData = { username: 'Admin' }; // Default user data
            if (data.token) {
                try {
                    const payloadBase64 = data.token.split('.')[1];
                    const decodedPayload = JSON.parse(atob(payloadBase64));
                    if (decodedPayload.user) {
                        userData = { 
                            id: decodedPayload.user.id,
                            username: decodedPayload.user.username,
                            isAdmin: decodedPayload.user.isAdmin 
                        };
                    }
                } catch (decodeError) {
                    console.error("Error decoding token:", decodeError);
                    // Keep default userData or handle error
                }
            }
            
            auth.login(data.token, userData); // Store token and user info in AuthContext
            navigate(from, { replace: true }); // Redirect to the intended page or dashboard
        } catch (err) {
            setError(err.message || 'Failed to login. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Basic inline styles (consider moving to CSS or Tailwind classes later)
    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh', // Take up most of the viewport height
        padding: '20px'
    };

    const formStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff'
    };

    const inputGroupStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontSize: '1rem'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3498db', // A nice blue
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold'
    };

    const errorStyle = {
        color: '#e74c3c', // A nice red
        marginBottom: '15px',
        textAlign: 'center'
    };


    return (
        <div style={pageStyle}>
            <div style={formStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2c3e50' }}>Admin Portal Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label htmlFor="username" style={labelStyle}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div style={inputGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p style={errorStyle}>{error}</p>}
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;