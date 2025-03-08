import React, { useRef, useCallback } from "react";
import JoditEditor from "jodit-react";
import { debounce } from "lodash"; // Import lodash debounce

const TextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  // Configuration for the JoditEditor toolbar and settings
  const config = {
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "|",
      "link",
      "image",
      "table",
      "|",
      "fullsize",
      "source",
      "print",
    ],
    uploader: {
      insertImageAsBase64URI: true, // Allows image uploads
    },
    placeholder: "Start typing your content here...",
  };

  // Debounce function to prevent excessive state updates
  const debouncedOnChange = useCallback(
    debounce((content) => {
      // console.log("Updating content:", content);
      onChange(content);
    }, 1500),
    [onChange]
  );

  const handleEditorChange = (newContent) => {
    debouncedOnChange(newContent);
  };

  return (
    <div className="editor-container">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onChange={handleEditorChange}
        className="custom-editor"
      />
    </div>
  );
};

export default TextEditor;

// import React from "react";
// import ReactQuill from "react-quill";

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, 3, 4, 5, 6, false] }], // Add more heading options
//     [{ font: [] }], // Add font size options
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ align: [] }],
//     [{ color: [] }, { background: [] }],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link", "image"],
//     ["clean"],
//   ],
// };

// const formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
//   "color",
//   "background",
//   "align",
// ];

// const TextEditor = ({ value, onChange }) => {
//   return (
//     <div>
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={onChange}
//         modules={modules}
//         formats={formats}
//       />
//     </div>
//   );
// };

// export default TextEditor;
