import { useEffect, useState, useRef } from 'react';
import { constant } from '../../../../utils/constants';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Spinner } from 'react-bootstrap';
import { InputLabel } from '@mui/material';

const SarcasmBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const quillRef = useRef(null);
  const bannerImageRef = useRef();

  const fetchBlogByID = async () => {
    try {
      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}${id}`);
      const json = await response.json();
      if (json.success) {
        setBlogData(json.data);
        setContent(json.data.body);
      } else {
        setError('Failed to fetch blog data');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching blog data');
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const updateBlogContent = async () => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('body', content);
      if (bannerImage) {
        formData.append('bannerImage', bannerImage);
      }

      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}`, {
        // const response = await fetch('http://192.168.16.33:8080/api/v1/sarcasm/blog', {
        method: 'PUT',
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        alert('Blog content updated successfully!');
      } else {
        setError('Failed to update blog content');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while updating blog data');
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogByID();
    }
  }, [id]);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await fetch(
            'http://35.225.122.157:8080/api/v1/sarcasm/gcp/upload-image',
            {
              method: 'POST',
              body: formData,
            }
          );

          const result = await response.json();
          if (result.success) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', result.data.url);
          } else {
            console.error('Image upload failed:', result.message);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
    }
  };

  const removeBannerImage = () => {
    setBannerImage(null);
    bannerImageRef.current.value = '';
  };

  useEffect(() => {
    if (quillRef && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', handleImageUpload);
    }
  }, [content]);

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };
   return (
    <div>
      <h1>Blog</h1>
      {error && <p>{error}</p>}
      {blogData ? (
        <div>
          <h2 className="sarcasm-blog-title">{blogData.title}</h2>
          <InputLabel>Upload Banner Image</InputLabel>
          <input
            type="file"
            name="bannerImage"
            ref={bannerImageRef}
            className="banner-img-conent-update"
            onChange={handleBannerImageChange}
          />
          {bannerImage ? (
            <div>
              <img
                src={URL.createObjectURL(bannerImage)}
                alt="Banner Preview"
                className="blog-img-preview-sarcasm"
              />
              <button
                type="button"
                className="remove-image-btn"
                onClick={removeBannerImage}
              >
                Remove Banner
              </button>
            </div>
          ) : (
            <div>
              <img
                src={blogData.bannerImageUrl}
                alt="Banner"
                className="blog-img-preview-sarcasm"
              />
            </div>
          )}

          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            theme="snow"
            modules={modules}
          />
          <div className="sarcasm-blog-save-container">
            <button
              className="sarcasm-blog-save-btn"
              onClick={updateBlogContent}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="sarcasm-blog-details-loader">
          <Spinner animation="border" />
        </p>
      )}
    </div>
  );
};

export default SarcasmBlog;
