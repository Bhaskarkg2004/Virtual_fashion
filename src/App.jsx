import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WardrobeProvider } from './context/WardrobeContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Wardrobe from './pages/Wardrobe';
import StyleGuide from './pages/StyleGuide';
import VirtualTryOn from './pages/VirtualTryOn';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // The Layout component is now applied directly within each route's element,
  // so ProtectedRoute no longer needs to wrap children with Layout.
  return children;
};

function App() {
  return (
    <AuthProvider>
      <WardrobeProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/wardrobe" element={
              <ProtectedRoute>
                <Layout>
                  <Wardrobe />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/style-guide" element={
              <ProtectedRoute>
                <Layout>
                  <StyleGuide />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/try-on" element={ // Changed from /virtual-try-on to /try-on to match original
              <ProtectedRoute>
                <Layout>
                  <VirtualTryOn />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Added Weather route */}
            <Route path="/weather" element={
              <ProtectedRoute>
                <Layout>
                  <Weather />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </WardrobeProvider>
    </AuthProvider>
  );
}

export default App;
