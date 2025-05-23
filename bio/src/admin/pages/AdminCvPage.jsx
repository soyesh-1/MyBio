import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCvInfo, uploadCv, deleteCv } from '../../services/api';

const AdminCvPage = () => {
    const [currentCv, setCurrentCv] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { token } = useAuth();

    const fetchCvDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            const data = await getCvInfo(); // Public endpoint
            setCurrentCv(data);
        } catch (err) {
            if (err.message.includes('404') || err.message.toLowerCase().includes('no cv found')) {
                setCurrentCv(null); // CV not found is not an error for display here
            } else {
                setError(err.message || 'Failed to fetch CV details.');
                console.error("Fetch CV error:", err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCvDetails();
    }, [fetchCvDetails]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setSuccessMessage('');
        setError('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a PDF file to upload.');
            return;
        }
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        const formData = new FormData();
        formData.append('cvFile', selectedFile); // 'cvFile' must match your backend multer field name

        setUploading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await uploadCv(formData, token);
            setSuccessMessage(response.msg || 'CV uploaded successfully!');
            setCurrentCv(response.cv); // Update current CV with new data
            setSelectedFile(null); // Clear file input
            document.getElementById('cvFileInput').value = ''; // Reset file input
        } catch (err) {
            setError(err.message || 'Failed to upload CV.');
            console.error("Upload CV error:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!currentCv) {
            setError('No CV to delete.');
            return;
        }
        if (!token) {
            setError('Authentication error. Please log in again.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the current CV (${currentCv.fileName})?`)) {
            setDeleting(true);
            setError('');
            setSuccessMessage('');
            try {
                const response = await deleteCv(token);
                setSuccessMessage(response.msg || 'CV deleted successfully!');
                setCurrentCv(null); // Clear current CV
            } catch (err) {
                setError(err.message || 'Failed to delete CV.');
                console.error("Delete CV error:", err);
            } finally {
                setDeleting(false);
            }
        }
    };

    // Basic inline styles
    const pageStyle = { maxWidth: '700px', margin: '20px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const sectionStyle = { marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' };
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '500' };
    const inputStyle = { marginBottom: '10px', display: 'block' };
    const buttonStyle = { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', marginRight: '10px' };
    const messageStyle = { padding: '10px', borderRadius: '4px', margin: '15px 0', textAlign: 'center' };

    if (loading) return <p style={{textAlign: 'center', marginTop: '20px'}}>Loading CV information...</p>;

    return (
        <div style={pageStyle}>
            <h2>Manage CV / Resume</h2>

            {error && <p style={{ ...messageStyle, background: '#ffdddd', color: '#d8000c' }}>Error: {error}</p>}
            {successMessage && <p style={{ ...messageStyle, background: '#d4edda', color: '#155724' }}>{successMessage}</p>}

            <div style={sectionStyle}>
                <h3>Current CV</h3>
                {currentCv ? (
                    <div>
                        <p><strong>File Name:</strong> {currentCv.originalName || currentCv.fileName}</p>
                        <p><strong>Uploaded:</strong> {new Date(currentCv.uploadedAt).toLocaleString()}</p>
                        <p>
                            <a 
                                href={`http://localhost:5001/${currentCv.filePath}`} // Adjust base URL if needed for production
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{color: '#3498db', textDecoration: 'underline'}}
                            >
                                View/Download Current CV
                            </a>
                        </p>
                        <button 
                            onClick={handleDelete} 
                            disabled={deleting}
                            style={{ ...buttonStyle, backgroundColor: '#e74c3c', marginTop: '10px' }}
                        >
                            {deleting ? 'Deleting...' : 'Delete Current CV'}
                        </button>
                    </div>
                ) : (
                    <p>No CV currently uploaded.</p>
                )}
            </div>

            <div style={sectionStyle}>
                <h3>Upload New CV (PDF only)</h3>
                <p style={{fontSize: '0.9em', color: '#555', marginBottom: '10px'}}>Uploading a new CV will replace the current one.</p>
                <div>
                    <label htmlFor="cvFileInput" style={labelStyle}>Choose CV File (PDF):</label>
                    <input 
                        type="file" 
                        id="cvFileInput"
                        accept=".pdf" 
                        onChange={handleFileChange} 
                        style={inputStyle} 
                    />
                </div>
                <button 
                    onClick={handleUpload} 
                    disabled={!selectedFile || uploading}
                    style={{ ...buttonStyle, backgroundColor: '#27ae60' }}
                >
                    {uploading ? 'Uploading...' : 'Upload/Replace CV'}
                </button>
            </div>
        </div>
    );
};

export default AdminCvPage;