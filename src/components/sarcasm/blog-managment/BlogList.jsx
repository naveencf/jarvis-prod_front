import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './app.css';
import { useNavigate } from 'react-router-dom';
import { constant } from '../../../utils/constants';

const BlogList = () => {
  const [show, setShow] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleCardClick = (blogId) => {
    navigate(`/admin/sarcasm/sarcasm-blog/${blogId}`);
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}`);
      const json = await response.json();

      const processedBlogs = json.data.map((blog) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(blog.body, 'text/html');
        const bannerImage = doc.getElementById('banner');
        if (bannerImage && blog.bannerImageUrl) {
          bannerImage.src = blog.bannerImageUrl;
        }
        return { ...blog, body: doc.body.innerHTML };
      });

      setBlogs(processedBlogs);
      setFilteredBlogs(processedBlogs);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredBlogs(blogs);
  };

  const handleClose = () => setShow(false);

  const handleSave = () => {
    console.log('Updated content:', editorContent);
    setShow(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="blog-sarcasm-sarcastic-container">
      <div
        className="search-container"
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search blogs..."
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '200px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <Button onClick={handleClearSearch} style={{ padding: '8px 16px', borderRadius: '6px' }}>
          Clear
        </Button>
      </div>

      {loading ? (
        <div className="shimmer-wrapper">
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
          <div className="shimmer-card"></div>
        </div>
      ) : (
        <ul className="blog-list-sarcasm-sarcastic">
          {filteredBlogs.map((blog) => (
            <li
              key={blog._id}
              className="sarcastic-blog-item"
              style={{ padding: '1.5rem' }}
            >
              {blog.title !== '' ? (
                <div
                  className="sarcastic-blog-card"
                  onClick={() => handleCardClick(blog._id)}
                  style={{
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    padding: '1rem',
                    width: '20rem',
                  }}
                >
                  <div
                    className="blog-banner"
                    style={{
                      width: '100%',
                      height: '250px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={blog.bannerImageUrl}
                      alt={blog.bannerAltDesc}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div className="blog-details" style={{ padding: '20px' }}>
                    <p
                      className="blog-title"
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '10px',
                      }}
                    >
                      {blog.title}
                    </p>
                    <p
                      className="blog-meta"
                      style={{
                        fontSize: '0.9rem',
                        color: '#888',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px',
                      }}
                    >
                      <span
                        className="blog-author"
                        style={{ fontWeight: 'bold' }}
                      >
                        By {blog.posted_by}
                      </span>
                      <span className="blog-date">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div
                    className="blog-footer"
                    style={{ textAlign: 'center', padding: '10px' }}
                  >
                    <a
                      href="#"
                      className="read-more"
                      style={{
                        fontSize: '1rem',
                        color: '#007BFF',
                        textDecoration: 'none',
                      }}
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal show={show} onHide={handleClose}>
        <Box
          sx={{
            width: '800px',
            maxWidth: '800px',
            margin: 'auto',
            backgroundColor: 'background.paper',
            boxShadow: 24,
            padding: 2,
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Blog Content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReactQuill value={editorContent} onChange={setEditorContent} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Box>
      </Modal>
    </div>
  );
};

export default BlogList;
