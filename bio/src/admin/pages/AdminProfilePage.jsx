import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfileInfo, uploadHeadshot } from '../../services/api';

const AdminProfilePage = () => {
    const [currentHeadshotUrl, setCurrentHeadshotUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // For image preview before upload

    const [loading, setLoading] = useState(true);      // For initial data load
    const [uploading, setUploading] = useState(false);  // For upload process
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { token } = useAuth();
    const backendBaseUrl = 'http://localhost:5001'; // For constructing full image URLs

    const fetchProfileDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            const data = await getProfileInfo();
            if (data && data.headshotImageUrl) {
                setCurrentHeadshotUrl(`${backendBaseUrl}/${data.headshotImageUrl}`);
            } else {
                setCurrentHeadshotUrl(null);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch profile details.');
            console.error("Fetch profile error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfileDetails();
    }, [fetchProfileDetails]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create a temporary URL for preview
            setSuccessMessage('');
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image file to upload.');
            return;
        }
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        const formData = new FormData();
        formData.append('headshotFile', selectedFile); // 'headshotFile' must match backend multer field

        setUploading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await uploadHeadshot(formData, token);
            setSuccessMessage(response.msg || 'Headshot uploaded successfully!');
            if (response.profile && response.profile.headshotImageUrl) {
                setCurrentHeadshotUrl(`${backendBaseUrl}/${response.profile.headshotImageUrl}`);
            }
            setSelectedFile(null);
            setPreviewUrl(null);
            document.getElementById('headshotFileInput').value = ''; // Reset file input
        } catch (err) {
            setError(err.message || 'Failed to upload headshot.');
            console.error("Upload headshot error:", err);
        } finally {
            setUploading(false);
        }
    };

    // Basic inline styles
    const pageStyle = { maxWidth: '600px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', background: '#fff' };
    const sectionStyle = { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' };
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '500' };
    const inputStyle = { marginBottom: '10px', display: 'block' };
    const buttonStyle = { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', backgroundColor: '#27ae60' };
    const messageStyle = { padding: '10px', borderRadius: '4px', margin: '15px 0', textAlign: 'center' };
    const imagePreviewStyle = { maxWidth: '200px', maxHeight: '200px', marginTop: '10px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', objectFit: 'cover' };


    return (
        <div style={pageStyle}>
            <h2>Manage Profile Headshot</h2>

            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error}</p>}
            {successMessage && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{successMessage}</p>}

            <div style={sectionStyle}>
                <h3>Current Headshot</h3>
                {loading && <p>Loading current headshot...</p>}
                {!loading && currentHeadshotUrl && (
                    <img src={currentHeadshotUrl} alt="Current Headshot" style={imagePreviewStyle} />
                )}
                {!loading && !currentHeadshotUrl && <p>No headshot currently uploaded.</p>}
            </div>

            <div style={sectionStyle}>
                <h3>Upload New Headshot</h3>
                <p style={{fontSize: '0.9em', color: '#555', marginBottom: '10px'}}>Uploading a new headshot will replace the current one.</p>
                <div>
                    <label htmlFor="headshotFileInput" style={labelStyle}>Choose Image File (JPG, PNG, GIF, WEBP):</label>
                    <input 
                        type="file" 
                        id="headshotFileInput"
                        accept="image/jpeg, image/png, image/gif, image/webp" 
                        onChange={handleFileChange} 
                        style={inputStyle} 
                    />
                </div>
                {previewUrl && (
                    <div>
                        <p>New image preview:</p>
                        <img src={previewUrl} alt="New headshot preview" style={imagePreviewStyle} />
                    </div>
                )}
                <button 
                    onClick={handleUpload} 
                    disabled={!selectedFile || uploading}
                    style={{ ...buttonStyle, marginTop: '10px' }}
                >
                    {uploading ? 'Uploading...' : 'Upload New Headshot'}
                </button>
            </div>
        </div>
    );
};

export default AdminProfilePage;