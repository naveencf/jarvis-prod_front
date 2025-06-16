import React, { useEffect, useState, useMemo } from "react";
import FormContainer from "../../AdminPanel/FormContainer";

const AuditedDataView = ({
  columns,
  modalData,
  setToggleModal,
  postLinks,
  initialIndex = 0,
  updateData,
  updateLocalData,
  allPages,
  tableData = [],
}) => {
  const filteredPostLinks = useMemo(() => {
    if (!tableData?.length) return postLinks;
    const tableIds = new Set(tableData.map((row) => String(row._id)));
    return postLinks.filter((post) => tableIds.has(String(post._id)));
  }, [postLinks, tableData]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentPost, setCurrentPost] = useState({ ...modalData });
  const [originalPost, setOriginalPost] = useState({ ...modalData });
  const [isEdit, setIsEdit] = useState(true);
  const [loading, setLoading] = useState(false);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentPost({ ...filteredPostLinks[newIndex] });
      setOriginalPost({ ...filteredPostLinks[newIndex] });
      setIsEdit(true);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredPostLinks.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setCurrentPost({ ...filteredPostLinks[newIndex] });
      setOriginalPost({ ...filteredPostLinks[newIndex] });
      setIsEdit(true);
    }
  };

  useEffect(() => {
    if (filteredPostLinks.length > 0) {
      const post = { ...filteredPostLinks[currentIndex] };
      post.page_name = post.owner_info?.username || post.page_name;
      setCurrentPost(post);
      setOriginalPost(post);
      setIsEdit(true);
    }
  }, [currentIndex, filteredPostLinks]);
  useEffect(() => {
    if (tableData?.length > 0) {
      const newIndex = tableData.findIndex(
        (row) => String(row._id) === String(modalData?._id)
      );
      setCurrentIndex(newIndex >= 0 ? newIndex : 0);
    }
  }, [tableData, modalData]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, filteredPostLinks]);

  const handleInputChange = (value, key) => {
    setCurrentPost((prev) => ({
      ...prev,
      [key]:
        typeof value === "object" && value?.target ? value.target.value : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedFields = {};
      for (const key in currentPost) {
        const originalValue = originalPost[key];
        const newValue = currentPost[key];

        if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
          updatedFields[key] = newValue;
        }
      }

      updatedFields["_id"] = String(currentPost._id);
      updatedFields["audit_status"] = String(currentPost.audit_status);
      updatedFields["sponsored"] = true;

      const formData = new FormData();
      for (const key in updatedFields) {
        const val = updatedFields[key];
        formData.append(
          key,
          typeof val === "object" ? JSON.stringify(val) : val
        );
      }

      const res = await updateData(formData);

      if (res?.error) {
        const errorMessage =
          typeof res.error === "string" ? res.error : JSON.stringify(res.error);
        throw new Error(errorMessage);
      }

      const updated = res.data?.data || currentPost;
      updateLocalData(updated);
      setCurrentPost(updated);
      setOriginalPost(updated);
      setIsEdit(false);
      alert("✅ Updated successfully!");
    } catch (err) {
      console.error("❌ Save error", err);
      alert(`Failed to update.\n\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flexCenterBetween formHeadingM0 mb16">
        <FormContainer
          mainTitle={`Audited Data (${currentIndex + 1}/${
            filteredPostLinks.length
          })`}
          link="true"
        />

        <div className="flexCenter colGap16">
          <div className="text-center flexCenter colGap4">
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr-2"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              ⬅ Previous
            </button>
            <button
              className="btn cmnbtn btn_sm btn-outline-primary mr-2"
              onClick={goToNext}
              disabled={currentIndex === filteredPostLinks.length - 1}
            >
              Next ➡
            </button>
            {!isEdit ? (
              <button
                className="btn cmnbtn btn_sm btn-primary"
                onClick={() => setIsEdit(true)}
              >
                ✏️ Edit
              </button>
            ) : (
              <button
                className="btn btn cmnbtn btn_sm btn-success"
                onClick={handleSave}
                disabled={loading}
              >
                ✅ Save
              </button>
            )}
          </div>
          <div className="icon-1" onClick={() => setToggleModal(false)}>
            X
          </div>
        </div>
      </div>

      <div className="card shadow-none m0">
        <div className="row auditedDataViewModal">
          {currentPost?.postImage && (
            <div className="col-md-2">
              <div className="auditedDataViewBox">
                <p>Post Image :</p>
                <img
                  src={currentPost?.postImage}
                  style={{ aspectRatio: "6/9" }}
                />
              </div>
            </div>
          )}

          {currentPost?.story_image && (
            <div className="col-md-2">
              <div className="auditedDataViewBox">
                <p>Story Image :</p>
                <img
                  src={currentPost?.story_image}
                  style={{ width: "100px", aspectRatio: "6/9" }}
                />
              </div>
            </div>
          )}

          <div className="col">
            <div className="auditedDataViewBox">
              <ul>
                {columns?.map((col, index) => {
                  const excludedKeys = [
                    "Sr.No",
                    "action",
                    "pageedits",
                    "postLinks",
                    "Pageedits",
                    "postStatus",
                    "postImage",
                    "story_image",
                    "price_key",
                    "post_dec",
                  ];
                  if (!excludedKeys.includes(col.key)) {
                    return (
                      <li key={index}>
                        <span
                          className="auditedDataViewBoxLabel"
                          style={{ minWidth: "140px" }}
                        >
                          {col.name}:
                        </span>
                        <div
                          className="auditedDataViewBoxInput"
                          style={{ flexGrow: 1 }}
                        >
                          {isEdit ? (
                            col.customEditElement ? (
                              col.customEditElement(
                                currentPost,
                                currentIndex,
                                () => {},
                                currentIndex,
                                (value, i, column, saveNow, overrideKey) => {
                                  if (typeof value === "object") {
                                    Object.entries(value).forEach(([k, v]) =>
                                      handleInputChange(v, k)
                                    );
                                  } else {
                                    const key = overrideKey || column.key;
                                    handleInputChange(value, key);
                                  }
                                },
                                col,
                                currentPost[col.key],
                                currentPost.vendor_id,
                                allPages
                              )
                            ) : (
                              <input
                                className="form-control"
                                type="text"
                                value={currentPost[col.key] ?? ""}
                                onChange={(e) =>
                                  handleInputChange(e.target.value, col.key)
                                }
                              />
                            )
                          ) : (
                            <span>{currentPost[col.key]}</span>
                          )}
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditedDataView;
