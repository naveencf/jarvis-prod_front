// ReactionButton.js
import React from "react";

const ReactionButton = ({ reactionType, handleReactionClick }) => {
  return (
    <button
      className="btn btn-primary"
      onClick={() => handleReactionClick(reactionType)}
    >
      {reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}
    </button>
  );
};

export default ReactionButton;
