import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BlogList from './pages/BlogList';
import BlogSlug from './pages/BlogSlug';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogSlug />} />
          <Route path="*" element={<Navigate to="/blogs" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;