import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const { data, isLoading } = useQuery('blogs', async () => {
    const res = await axios.get('/api/blogs');
    return res.data;
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Blog List</h2>
      {data.map((blog) => (
        <div key={blog.slug} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
          <Link to={`/blogs/${blog.slug}`}><h3>{blog.title}</h3></Link>
          <p>{blog.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;