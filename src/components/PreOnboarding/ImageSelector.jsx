import React from "react";

const ImageSelector = ({
  imagePreview,
  handleImageClick,
  nickName,
  setNickName,
  images,
  handleImageUpload,
  handleSubmitProfile,
  selectedImage,
  CloseImageSelector,
}) => {
  return (
    <div className="modal-body">
      <div>
        {selectedImage && (
          <div className="showImg">
            <img src={imagePreview} alt="Selected" />
          </div>
        )}

        <div className="chooseImg">
          <div className="d-flex justify-content-between">
            <h5>Choose :</h5>
            <div onClick={CloseImageSelector}>
              <i className="bi bi-x-circle-fill" />
            </div>
          </div>
          <div className="chooseImgItem">
            {images.map((image) => (
              <img
                key={image}
                src={image}
                // alt={imageName}
                onClick={() => handleImageClick(image)}
              />
            ))}
          </div>
        </div>

        <div className="formImg">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h5>Upload Image :</h5>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required={false}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <h5>Nick Name :</h5>
              <input
                type="text"
                className="form-control"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="alert_text">
        <button
          type="button"
          className="cmnbtn btn btn-success"
          onClick={handleSubmitProfile}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;
