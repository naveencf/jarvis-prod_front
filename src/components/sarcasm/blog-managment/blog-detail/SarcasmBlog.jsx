import { useEffect, useState, useRef } from "react";
import { constant } from "../../../../utils/constants";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "react-bootstrap";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { baseUrl } from "../../../../utils/config";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "8px",
  p: 4,
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px", // Add space between elements
  alignItems: "stretch",
};

const SarcasmBlog = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [rawContent, setRawContent] = useState("");
  const [error, setError] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [updateTitle, setUpdateTitle] = useState("");
  const quillRef = useRef(null);
  const bannerImageRef = useRef();

  useEffect(() => {
    setUpdateTitle(blogData?.title);
  }, [blogData]);

  // Transform content by adding custom classes
  const appendClassToSpecificTags = (htmlString) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      doc.body
        .querySelectorAll("h1")
        .forEach((element) => element.classList.add("heading-main"));
      doc.body
        .querySelectorAll("blockquote")
        .forEach((element) => element.classList.add("single-blog-content"));
      doc.body
        .querySelectorAll("h2")
        .forEach((element) => element.classList.add("heading-secondary"));
      doc.body
        .querySelectorAll("h3")
        .forEach((element) => element.classList.add("heading-tertiary"));
      doc.body
        .querySelectorAll("p")
        .forEach((element) => element.classList.add("paragraph-content"));
      doc.body
        .querySelectorAll("ul")
        .forEach((element) => element.classList.add("unordered-list"));
      doc.body
        .querySelectorAll("li")
        .forEach((element) => element.classList.add("list-item"));
      return doc.body.innerHTML;
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return htmlString;
    }
  };

  // Fetch blog by ID
  const fetchBlogByID = async () => {
    try {
      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}${id}`);
      const json = await response.json();
      if (json.success) {
        setBlogData(json.data);
        setRawContent(json.data.body);
      } else {
        setError("Failed to fetch blog data");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching blog data");
    }
  };

  // Handle content change from ReactQuill
  const handleRawContentChange = (value) => {
    setRawContent(value);
  };

  // Save updated blog content
  const updateBlogContent = async () => {
    try {
      // Transform content only on save
      const bannerImgTag = `<img src="" alt="" id="banner" class="banner-img"/>`;
      const transformedContent =
        bannerImgTag + appendClassToSpecificTags(rawContent);
      console.log("transformedContent", transformedContent);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("body", transformedContent);
      if (bannerImage) {
        formData.append("bannerImage", bannerImage);
      }
      ("");
      const response = await fetch(`${constant.CONST_SARCASM_BLOG_POST}`, {
        method: "PUT",
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        alert("Blog content updated successfully!");
      } else {
        setError("Failed to update blog content");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while updating blog data");
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          const response = await fetch(
            `${baseUrl}v1/sarcasm/gcp/upload-image`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();
          if (result.success) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", result.data.url);
          } else {
            console.error("Image upload failed:", result.message);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
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
    bannerImageRef.current.value = "";
  };

  // Set up custom image handler for Quill
  useEffect(() => {
    if (quillRef && quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("image", handleImageUpload);
    }
  }, []);

  // Fetch blog data on component mount
  useEffect(() => {
    if (id) {
      fetchBlogByID();
    }
  }, [id]);

  const handleSubmitTitle = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", updateTitle);
      const res = await axios.put(baseUrl + "v1/sarcasm/blog", formData);
      toastAlert("Title Updated");
      handleClose();
      fetchBlogByID();
    } catch (error) {
      console.log(error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div>
      <h1>Blog</h1>
      {error && <p>{error}</p>}
      {blogData ? (
        <div>
          <div className="d-flex">
            <h2 className="sarcasm-blog-title">{blogData.title}</h2>
            <div className="icon-1 ">
              <i onClick={handleOpen} className="bi bi-pencil" />
            </div>
          </div>
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
            value={rawContent}
            onChange={handleRawContentChange}
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl sx={formStyle}>
            <InputLabel htmlFor="my-input">Title</InputLabel>
            <Input
              id="my-input"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              aria-describedby="my-helper-text"
              sx={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmitTitle}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                padding: "8px 16px",
                textTransform: "none", // Avoid uppercase
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#1565c0", // Darker shade on hover
                },
              }}
            >
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
};

export default SarcasmBlog;
