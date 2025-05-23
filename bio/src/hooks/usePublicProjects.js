// src/viewmodel/usePublicProjects.js
import { useState, useEffect } from 'react';

export const usePublicProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    // ... error handling ...

    useEffect(() => {
        fetch('/api/projects') // Assuming your backend is on the same domain or proxied
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => { /* ... handle error ... */ setLoading(false); });
    }, []);
    return { projects, loading, projectsSectionTitle: "My Projects" };
};