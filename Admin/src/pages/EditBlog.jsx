import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    axios.get(`/api/blogs/${slug}`).then(res => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setTags(res.data.tags.join(', '));
    });
  }, [slug]);

  const handleUpdate = async () => {
    await axios.put(`/api/blogs/${slug}`, { title, content, tags: tags.split(',').map(t => t.trim()) }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/admin/blogs');
  };

  return (
    <div>
      <h2>Edit Blog</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={10} />
      <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default EditBlog;
