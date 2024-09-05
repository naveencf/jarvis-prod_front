import { useState } from "react";

const CommentForm = ({ announcementId, handlePostComment, isSubmitting }) => {
  const [comment, setComment] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    handlePostComment(announcementId, comment);
    setComment("");
  };
  

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-row align-items-center gap4 w-100">
      <textarea type="text"
      className="form-control border-round"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        disabled={isSubmitting} // Disable textarea when submitting
        style={{height:"42px"}}
      />
      <button className="icon" type="submit" disabled={isSubmitting}>
        <i className="bi bi-send"></i>
      </button>
    </form>
  );
};
export default CommentForm;
