import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public Site Layout & Components
import PublicSiteLayout from './pages/PublicSiteLayout';

// Admin Panel Pages & Layout
import LoginPage from './admin/pages/LoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminProjectsPage from './admin/pages/AdminProjectsPage';
import AdminLayout from './admin/components/AdminLayout';
import AdminAddProjectPage from './admin/pages/AdminAddProjectPage';
import AdminEditProjectPage from './admin/pages/AdminEditProjectPage';
import AdminBlogPostsPage from './admin/pages/AdminBlogPostsPage';
import AdminAddBlogPostPage from './admin/pages/AdminAddBlogPostPage';
import AdminEditBlogPostPage from './admin/pages/AdminEditBlogPostPage';
import AdminCvPage from './admin/pages/AdminCvPage';
import AdminProfilePage from './admin/pages/AdminProfilePage';

// Hook for global navbar logic
import { useNavbarLogic } from './viewmodel/useNavbarLogic';

// ProtectedRoute component
const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Outlet />; // Renders the matched child route
};

// PublicSite component (wrapper for your public pages)
const PublicSite = () => {
    return (
        <>
            <PublicSiteLayout />
        </>
    );
};

function App() {
    useNavbarLogic(); // Initialize global navbar logic (e.g., for public site smooth scroll)

    return (
        <div className="font-inter antialiased text-gray-800 bg-white"> {/* Your global app wrapper */}
            <Routes>
                {/* Public Site Route - Catches all non-admin paths first for clarity */}
                <Route path="/*" element={<PublicSite />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}> {/* This protects all nested admin routes */}
                    
                    {/* Route for the standalone Admin Dashboard (Hero Page) */}
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                    {/* Routes for other admin pages that WILL use the AdminLayout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* If someone navigates to just "/admin", redirect them to the dashboard */}
                        {/* Note: Dashboard is outside this AdminLayout, so this redirect is important. */}
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        
                        <Route path="projects" element={<AdminProjectsPage />} />
                        <Route path="projects/new" element={<AdminAddProjectPage />} />
                        <Route path="projects/edit/:projectId" element={<AdminEditProjectPage />} />
                        
                        <Route path="blog" element={<AdminBlogPostsPage />} />
                        <Route path="blog/new" element={<AdminAddBlogPostPage />} />
                        <Route path="blog/edit/:postId" element={<AdminEditBlogPostPage />} />
                        
                        <Route path="cv" element={<AdminCvPage />} />
                        <Route path="profile" element={<AdminProfilePage />} />
                        
                        {/* Any other admin sub-pages that need the AdminLayout go here */}
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;