const API_BASE_URL = "https://mybio-1.onrender.com"; // Your backend URL

// --- Auth Functions ---
export const loginAdmin = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data; // Expected: { token: "..." }
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};

// --- Project Functions ---
export const getProjects = async (token) => { // Token is optional here
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/projects`, { headers });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get Projects API error:", error);
        throw error;
    }
};

export const getProjectById = async (projectId, token) => { // Token is optional here
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, { headers });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Get Project By ID (${projectId}) API error:`, error);
        throw error;
    }
};

export const createProject = async (projectData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(projectData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Create Project API error:", error);
        throw error;
    }
};

export const updateProject = async (projectId, projectData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(projectData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Update Project API error:", error);
        throw error;
    }
};

export const deleteProject = async (projectId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Delete Project API error:", error);
        throw error;
    }
};

// --- CV Functions ---
export const uploadCv = async (formData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cv/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Upload CV API error:", error);
        throw error;
    }
};

export const getCvInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cv`);
        if (!response.ok) {
             // If no CV is found (404), it's not a hard error for this function's purpose
            if (response.status === 404) {
                console.log('No CV info found from API.');
                return null; 
            }
            const data = await response.json().catch(() => ({ msg: "Invalid JSON response or server error" }));
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get CV Info API error:", error);
        if (error.message && !error.message.toLowerCase().includes('no cv found') && String(error).indexOf('404') === -1) {
             throw error; // Re-throw only unexpected errors
        }
        return null; // Return null for "expected" not found or other handled issues
    }
};

export const deleteCv = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cv`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Delete CV API error:", error);
        throw error;
    }
};

// --- Blog Post API Functions ---
export const getAdminBlogPosts = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get Admin Blog Posts API error:", error);
        throw error;
    }
};

export const createBlogPost = async (postData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Create Blog Post API error:", error);
        throw error;
    }
};

export const getBlogPostByIdAdmin = async (postId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Get Blog Post By ID Admin (${postId}) API error:`, error);
        throw error;
    }
};

export const updateBlogPost = async (postId, postData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error(`Update Blog Post (${postId}) API error:`, error);
        throw error;
    }
};

export const deleteBlogPost = async (postId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error(`Delete Blog Post (${postId}) API error:`, error);
        throw error;
    }
};

export const getPublicBlogPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/public`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get Public Blog Posts API error:", error);
        throw error;
    }
};

export const getPublicBlogPostBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog/public/${slug}`);
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Get Public Blog Post by Slug (${slug}) API error:`, error);
        throw error;
    }
};

// --- Profile/Headshot API Functions ---
export const getProfileInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/headshot`);
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No profile/headshot info found from API (api.js).');
                return null;
            }
            const data = await response.json().catch(() => ({ msg: "Invalid JSON response for profile info error" }));
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get Profile Info API error:", error);
        if (error.message && !error.message.toLowerCase().includes('no headshot image found') && String(error).indexOf('404') === -1) {
             throw error;
        }
        return null;
    }
};

export const uploadHeadshot = async (formData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/profile/headshot`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Upload Headshot API error:", error);
        throw error;
    }
};