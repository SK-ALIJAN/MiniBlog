import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminBlogs from './pages/AdminBlogs';
import EditBlog from './pages/EditBlog';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/blogs" element={isAuthenticated ? <AdminBlogs /> : <Navigate to="/login" />} />
          <Route path="/admin/edit/:slug" element={isAuthenticated ? <EditBlog /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/admin/blogs" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;