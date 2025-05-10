import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const BlogSlug = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery(['blog', slug], async () => {
    const res = await axios.get(`/api/blogs/${slug}`);
    return res.data;
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.content}</p>
    </div>
  );
};

export default BlogSlug;
