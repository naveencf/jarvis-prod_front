import React, { useEffect, useState } from "react";
import PostGenerator from "../../InstaPostGenerator/PostGenerator";

const PhotoPreview = ({ planData, setToggleModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        next();
      } else if (event.key === "ArrowLeft") {
        previous();
      } else if (event.which === 27) {
        setToggleModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  function next() {
    setActiveIndex((prev) => {
      if (prev === planData.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  }
  function previous() {
    setActiveIndex((prev) => {
      if (prev === 0) {
        return planData.length - 1;
      }
      return prev - 1;
    });
  }
  return (
    <>
      <div className="photoPreviewModal">
        <div className="icon-1 btnClose" onClick={() => setToggleModal(false)}>
          X
        </div>
        <div className="flex-row flex_center_center">
          <div className="icon-1 prevBtn mr-3" onClick={previous}>
            <bi className="bi-chevron-left"></bi>
          </div>
          <PostGenerator singledata={planData[activeIndex]} preview={true} />
          <div className="icon-1 nextBtn ml-3" onClick={next}>
            <bi className="bi-chevron-right"></bi>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoPreview;
