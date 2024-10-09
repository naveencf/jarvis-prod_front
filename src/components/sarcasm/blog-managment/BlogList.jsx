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
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleShow = (blog) => {
  //   setEditorContent(blog?.body || '');
  //   setShow(true);
  // };

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
          {blogs.map((blog) => (
            <li key={blog._id} className="sarcastic-blog-item">
              {blog.title !== '' ? (
                <div
                  className="sarcastic-blog-card"
                  onClick={() => handleCardClick(blog._id)}
                >
                  <p className="sarcastic-blog-title">{blog.title}</p>
                </div>
              ) : (
                ''
              )}
              {/* <div className="sarcastic-edit-button-container">
              <Button variant="primary" onClick={() => handleShow(blog)}>
                Edit Details
              </Button>
            </div> */}
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
