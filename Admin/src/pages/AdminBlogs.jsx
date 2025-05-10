import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminBlogs = () => {
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('blogs', async () => {
    const res = await axios.get('/api/blogs');
    return res.data;
  });

  const deleteMutation = useMutation(
    async (slug) => {
      await axios.delete(`/api/blogs/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries('blogs'),
    }
  );

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Blog Management</h2>
      {data.map((blog) => (
        <div key={blog.slug} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <h3>{blog.title}</h3>
          <p>{blog.content.substring(0, 100)}...</p>
          <Link to={`/admin/edit/${blog.slug}`}><button>Edit</button></Link>
          <button onClick={() => deleteMutation.mutate(blog.slug)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminBlogs;
