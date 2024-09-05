import React from "react";

const CocTabPreonboarding = ({ cocData }) => {
  return (
    <>
      <div className="cardBoard">
        <div className="cardBodyBoard">
          <div
            className="thm_textbx"
            dangerouslySetInnerHTML={{ __html: cocData }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default CocTabPreonboarding;
