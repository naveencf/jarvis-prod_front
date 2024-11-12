import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { constant } from '../../../utils/constants';
import Swal from 'sweetalert2';
import { Spinner } from 'react-bootstrap';

const ContentForm = () => {
  const [formState, setFormState] = useState({
    content: '',
    title: '',
    blogCategoryId: '',
    bannerAltDesc: '',
    metaTitle: '',
    metaDescription: '',
    altDescription: '',
    bannerImage: null,
    posted_by: '',
    blogImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [imageInsertLocation, setImageInsertLocation] = useState(null);
  const bannerImageRef = useRef();
  // const blogImagesRef = useRef();
  const quillRef = useRef(null);

  const handleEditorChange = (value) => {
    setFormState((prevState) => ({ ...prevState, content: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    setFormState((prevState) => ({
      ...prevState,
      bannerImage: file,
    }));
  };

  // const handleBlogImagesChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     blogImages: [...prevState.blogImages, ...files],
  //   }));
  // };

  const removeBannerImage = () => {
    setFormState((prevState) => ({
      ...prevState,
      bannerImage: null,
    }));
    bannerImageRef.current.value = '';
  };

  // const removeBlogImage = (index) => {
  //   const updatedImages = formState.blogImages.filter((_, i) => i !== index);
  //   setFormState((prevState) => ({
  //     ...prevState,
  //     blogImages: updatedImages,
  //   }));
  // };

  const appendClassToSpecificTags = (htmlString) => {
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

    // Group images inside a specific <div class="row"> structure
    const paragraphs = doc.querySelectorAll('p.paragraph-content');

    paragraphs.forEach((paragraph) => {
      const images = Array.from(paragraph.querySelectorAll('img'));

      if (images.length > 0) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        images.forEach((img) => {
          const colDiv = document.createElement('div');
          colDiv.classList.add('col-4');
          colDiv.appendChild(img.cloneNode(true)); // Clone the image inside col-4
          rowDiv.appendChild(colDiv); // Append col-4 to row
          img.remove(); // Remove original image from paragraph
        });

        paragraph.appendChild(rowDiv); // Append the row to the paragraph
      }
    });

    return doc.body.innerHTML;
  };

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(constant.CONST_SARCASM_BLOG_CATEGORY);
      const json = await response.json();
      setCategoryData(json.data);
    } catch (error) {
      console.error(error);
    }
  };
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
          const response = await fetch(constant.CONST_SARCASM_IMAGE_UPLOAD, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.success) {
            // Insert the image URL into the Quill editor
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', result.data.url);

            setFormState((prevState) => ({
              ...prevState,
              blogImages: [
                ...prevState.blogImages,
                { name: file.name, url: result.data.url },
              ],
            }));
          } else {
            console.error('Image upload failed:', result.message);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.blogCategoryId === '') {
      alert('Please select the category');
      return;
    }
    setLoading(true);
    try {
      const modifiedHtml = appendClassToSpecificTags(formState.content);
      const formData = new FormData();
      formData.append('blogCategoryId', formState.blogCategoryId);
      formData.append('title', formState.title);

      let bannerImgHtml = '';
      if (formState.bannerImage) {
        bannerImgHtml = `<img src="" alt="${formState.bannerAltDesc}" id="banner" class="banner-img"/>`;
      }

      let blogImagesHtml = '';
      if (formState.blogImages.length) {
        formState.blogImages.forEach((file) => {
          formData.append('blog_images', file.url);
        });
      }

      const finalHtml = `${bannerImgHtml}${modifiedHtml}${blogImagesHtml}`;
      formData.append('body', finalHtml);

      formData.append('bannerAltDesc', formState.bannerAltDesc);
      formData.append('posted_by', formState.posted_by);
      formData.append('metaTitle', formState.metaTitle);
      formData.append('metaDescription', formState.metaDescription);
      formData.append('altDescription', formState.altDescription);

      if (formState.bannerImage) {
        formData.append('bannerImage', formState.bannerImage);
      }

      const response = await fetch(constant.CONST_SARCASM_BLOG_POST, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Blog submitted successfully!',
          text: 'Your blog has been published.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to submit the blog',
          text: 'There was a problem with your submission.',
        });
      }
    } catch (error) {
      console.error('Error submitting the blog:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred while submitting the blog.',
      });
    }

    // setFormState({
    //   content: '',
    //   title: '',
    //   blogCategoryId: '',
    //   bannerAltDesc: '',
    //   metaTitle: '',
    //   metaDescription: '',
    //   altDescription: '',
    //   bannerImage: null,
    //   blogImages: [],
    // });
  };
  useEffect(() => {
    if (quillRef && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', handleImageUpload);
    }
  }, [formState]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

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

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <form className="content-form" onSubmit={handleSubmit}>
      <h2 className="content-form__header">Create Content</h2>

      <div className="content-input-container">
        <div>
          <input
            type="text"
            name="title"
            className="content-form__input-text"
            placeholder="Title"
            value={formState.title}
            onChange={handleInputChange}
          />
          <div className="blog-category-dropdown">
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formState.blogCategoryId}
                label="Category"
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    blogCategoryId: e.target.value,
                  }))
                }
              >
                {categoryData.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div>
          <input
            type="text"
            name="bannerAltDesc"
            className="content-form__input-text"
            placeholder="Banner Alt Description"
            value={formState.bannerAltDesc}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="metaTitle"
            className="content-form__input-text"
            placeholder="Meta Title"
            value={formState.metaTitle}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <input
          type="text"
          name="metaDescription"
          className="content-form__input-text"
          placeholder="Meta Description"
          value={formState.metaDescription}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="altDescription"
          className="content-form__input-text"
          placeholder="Alt Description"
          value={formState.altDescription}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="posted_by"
          className="content-form__input-text"
          placeholder="posted by"
          value={formState.posted_by}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <InputLabel>Upload Banner Image</InputLabel>
        <input
          type="file"
          name="bannerImage"
          ref={bannerImageRef}
          onChange={handleBannerImageChange}
        />
        {formState.bannerImage && (
          <div>
            <img
              src={URL.createObjectURL(formState.bannerImage)}
              alt="Banner Preview"
              className="blog-imh-preview"
            />
            <button
              type="button"
              className="remove-image-btn"
              onClick={removeBannerImage}
            >
              Remove Banner
            </button>
          </div>
        )}
      </div>

      <ReactQuill
        ref={quillRef}
        value={formState.content}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        className="content-form__react-quill"
      />

      {loading ? (
        <div className="sarcam-submit-btn-loader">
          <Spinner animation="border" />
        </div>
      ) : (
        <button type="submit" className="content-form__submit-button">
          Submit
        </button>
      )}
    </form>
  );
};

export default ContentForm;
