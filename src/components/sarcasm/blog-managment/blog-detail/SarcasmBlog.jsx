import { useEffect, useState, useRef } from 'react';
import { constant } from '../../../../utils/constants';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Spinner } from 'react-bootstrap';
import { InputLabel } from '@mui/material';
import { baseUrl } from '../../../../utils/config';

const SarcasmBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const quillRef = useRef(null);
  const bannerImageRef = useRef();
  const appendClassToSpecificTags = (htmlString) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      // Add classes to specific tags
      doc.body
        .querySelectorAll('h1')
        .forEach((element) => element.classList.add('heading-main'));
      doc.body
        .querySelectorAll('blockquote')
        .forEach((element) => element.classList.add('single-blog-content'));
      doc.body
        .querySelectorAll('h2')
        .forEach((element) => element.classList.add('heading-secondary'));
      doc.body
        .querySelectorAll('h3')
        .forEach((element) => element.classList.add('heading-tertiary'));
      doc.body
        .querySelectorAll('p')
        .forEach((element) => element.classList.add('paragraph-content'));
      doc.body
        .querySelectorAll('ul')
        .forEach((element) => element.classList.add('unordered-list'));
      doc.body
        .querySelectorAll('li')
        .forEach((element) => element.classList.add('list-item'));

      const paragraphs = Array.from(
        doc.querySelectorAll('p.paragraph-content')
      );

      paragraphs.forEach((paragraph, index) => {
        const images = Array.from(paragraph.querySelectorAll('img'));

        // If the current paragraph contains images and is followed by another paragraph with images
        if (images.length > 0) {
          const nextParagraph = paragraphs[index + 1];
          const nextImages = nextParagraph
            ? Array.from(nextParagraph.querySelectorAll('img'))
            : [];

          // If both the current and next paragraphs contain images
          if (nextImages.length > 0) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            images.forEach((img) => {
              const colDiv = document.createElement('div');
              colDiv.classList.add('col-4');
              colDiv.appendChild(img);
              rowDiv.appendChild(colDiv);
            });

            nextImages.forEach((img) => {
              const colDiv = document.createElement('div');
              colDiv.classList.add('col-4');
              colDiv.appendChild(img);
              rowDiv.appendChild(colDiv);
            });

            // Replace both paragraphs with a single rowDiv
            paragraph.replaceWith(rowDiv);
            nextParagraph.remove(); // Remove the next paragraph as its images are now merged
          } else {
            // Wrap individual images in a row if they are not consecutive
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            images.forEach((img) => {
              const colDiv = document.createElement('div');
              colDiv.classList.add('col-4');
              colDiv.appendChild(img);
              rowDiv.appendChild(colDiv);
            });

            paragraph.appendChild(rowDiv); // Append the row to the paragraph
          }
        }
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return htmlString; // Return original string if parsing fails
    }
  };
  const fetchBlogByID = async () => {
    try {
      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}${id}`);
      const json = await response.json();
      if (json.success) {
        setBlogData(json.data);
        setContent(appendClassToSpecificTags(json.data.body));
      } else {
        setError('Failed to fetch blog data');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching blog data');
    }
  };

  const handleContentChange = (value) => {
    setContent(appendClassToSpecificTags(value));
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
            `${baseUrl}v1/sarcasm/gcp/upload-image`,
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
