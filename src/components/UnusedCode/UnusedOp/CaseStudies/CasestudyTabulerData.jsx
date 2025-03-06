import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { GridToolbarColumnsButton } from "@mui/x-data-grid";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import DeleteButton from "../../DeleteButton";
import { baseUrl } from "../../../../utils/config";
import axios from "axios";

function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}

const CasestudyTabulerData = ({
  backupData,
  brandCategory,
  brandSubCatData,
  countData,
  newData,
  getData,
  setNewData
}) => {
  console.log(brandSubCatData);
  const navigate = useNavigate();
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [enlargedFileUrl, setEnlargedFileUrl] = useState("");
  const [enlargedFileType, setEnlargedFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterModel, setFilterModel] = useState({
    items: [
      {
        _id: 1,
        field: "brand_name",
        // value: [5000, 15000],
        // operator: 'between',
      },
    ],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    S_NO: true,
    brand_name: true,
    campaign_purpose: true,
    categoryName: true,
    subcat: true,
    designed_by: true,
    created_by_name: true,
    number_of_views: true,
    operation_remark: false,
    platform_name: false,
    public_usage: false,
    feedback: false,
    number_of_engagement: false,
    number_of_impression: true,
    number_of_post: true,
    number_of_reach: true,
    number_of_story_views: true,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEnlargedFileType("");
    setEnlargedFileUrl("");
  };

  const handleFileClick = (fileType, fileUrl) => {
    setEnlargedFileType(fileType);
    setEnlargedFileUrl(fileUrl);
    setIsModalOpen(true);
  };


  useEffect(() => {
    setNewData(newData)
  }, [brandCategory])
  const renderEnlargedContent = () => {
    switch (enlargedFileType) {
      case "image":
        return (
          <img
            src={enlargedFileUrl}
            alt="Enlarged Image"
            style={{ maxWidth: "100%", maxHeight: "auto" }}
          />
        );
      case "pdf":
        return (
          <iframe
            src={enlargedFileUrl}
            title="file"
            width="100%"
            height="100%"
          ></iframe>
        );
      case "video":
        return (
          <video src={enlargedFileUrl} controls width="50%" height="auto" />
        );
      default:
        return null;
    }
  };



  // resizeing columns ---->
  const [columns, setColumns] = useState([
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = newData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },



    {
      field: "campaign_purpose",
      headerName: "Campaign",
      width: 180,
      renderCell: (params) => {
        const campName = params.value;
        const capitalizedCampName =
          campName.charAt(0).toUpperCase() + campName.slice(1);
        return <div>{capitalizedCampName}</div>;
      },
    },
    {
      field: "brand_name",
      headerName: "Brand",
      width: 180,
      renderCell: (params) => {
        const brandName = params.value;
        const capitalizedBrandName =
          brandName.charAt(0).toUpperCase() + brandName.slice(1);
        return <div>{capitalizedBrandName}</div>;
      },
    },

    {
      field: "categoryName",
      headerName: "Category",
      width: 180,
      renderCell: (params) => {
        console.log(brandCategory, "brandcat")
        const category = brandCategory?.find(
          (cat) => cat.category_id === params.row.brand_category_id
        );
        return <div>{category?.category_name}</div>;
      },
    },
    {
      field: "subcat",
      headerName: "Sub Category",
      width: 180,
      renderCell: (params) => {
        const subCategory = brandSubCatData?.find(
          (cat) => cat.sub_category_id === params.row.brand_sub_category_id
        );
        return <div>{subCategory?.sub_category_name}</div>;
      },
    },
    {
      field: "designed_by",
      headerName: "Designed by",
      width: 180,
    },
    {
      field: "no_logo_image",
      headerName: "PDF",
      width: 180,
      renderCell: (params, index) => {
        const url = params.value;
        let detail = params.row;

        return (
          <div className="summary_box text-center ml-auto mr-auto">
            {detail.data_type === "jpg" ||
              detail.data_type === "png" ||
              detail.data_type === "jpeg" ? (
              <div
                id={`carouselExampleControls_${index}`}
                className="carousel slide"
                data-ride="carousel"
              >
                <div className="carousel-inner">
                  {countData
                    ?.filter(
                      (item) =>
                        item.data_name === detail.data_name &&
                        item.no_logo_image != null
                    )
                    .map((filteredItem, index) => (
                      <>
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""
                            }`}
                          data-interval="10000"
                        >
                          {filteredItem.data_type === "jpg" ||
                            filteredItem.data_type === "png" ||
                            filteredItem.data_type === "jpeg" ? (
                            <img
                              onClick={() =>
                                handleFileClick(
                                  "image",
                                  filteredItem.no_logo_image
                                )
                              }
                              className="d-block w-100"
                              src={filteredItem.no_logo_image}
                              alt={`Slide ${index + 1}`}
                            />
                          ) : filteredItem.data_type == "pdf" ? (
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "auto",
                              }}
                            >
                              {" "}
                              {/* Adjust the height as needed */}
                              <iframe
                                allowFullScreen={true}
                                src={filteredItem.no_logo_image}
                                title="PDF Viewer"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  overflow: "hidden",
                                }}
                              />
                              <div
                                onClick={() =>
                                  handleFileClick(
                                    "pdf",
                                    filteredItem.no_logo_image
                                  )
                                }
                                style={{
                                  position: "absolute",
                                  width: "64%",
                                  height: "46%",
                                  top: "18px",
                                  left: "10px",
                                  cursor: "pointer",
                                  background: "rgba(0, 0, 0, 0)", // This makes the div transparent
                                  zIndex: 10, // This ensures the div is placed over the iframe
                                }}
                              ></div>
                            </div>
                          ) : filteredItem.data_type == "mp4" ? (
                            <video
                              className=""
                              controls
                              width="100%"
                              height="auto"
                            >
                              <source
                                src={filteredItem.no_logo_image}
                                type={`video/mp4`}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "auto",
                              }}
                            >
                              {" "}
                              {/* Adjust the height as needed */}
                              <iframe
                                allowFullScreen={true}
                                src={filteredItem.no_logo_image}
                                title="PDF Viewer"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  overflow: "hidden",
                                }}
                              />
                              <div
                                onClick={() =>
                                  handleFileClick(
                                    "pdf",
                                    filteredItem.no_logo_image
                                  )
                                }
                                style={{
                                  position: "absolute",
                                  width: "64%",
                                  height: "71%",
                                  top: 0,
                                  left: "21px",
                                  cursor: "pointer",
                                  background: "rgba(0, 0, 0, 0)", // This makes the div transparent
                                  zIndex: 10, // This ensures the div is placed over the iframe
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-target={`#carouselExampleControls_${index}`}
                  data-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-target={`#carouselExampleControls_${index}`}
                  data-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="sr-only">Next</span>
                </button>
              </div>
            ) : detail.data_type === "pdf" ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "auto",
                }}
              >
                <iframe
                  allowFullScreen={true}
                  src={detail.no_logo_image}
                  title="PDF Viewer"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    overflow: "hidden",
                  }}
                />
                <div
                  onClick={() => handleFileClick("pdf", detail.no_logo_image)}
                  style={{
                    position: "absolute",
                    width: "64%",
                    height: "71%",
                    top: 0,
                    left: "21px",
                    cursor: "pointer",
                    background: "rgba(0, 0, 0, 0)", // This makes the div transparent
                    zIndex: 10, // This ensures the div is placed over the iframe
                  }}
                ></div>
              </div>
            ) : detail.data_type === "mp4" ? (
              <img
                onClick={() => handleFileClick("video", detail.no_logo_image)}
                src={"video"}
                width="80px"
                height="80px"
              />
            ) : (
              <img src={"video"} width="80px" height="80px" />
            )}
          </div>
        );
      },
    },

    {
      field: "created_by_name",
      headerName: "Uploaded by",
      width: 125,
    },
    {
      field: "number_of_engagement",
      headerName: "Engagement",
      width: 180,
    },
    {
      field: "number_of_impression",
      headerName: "Impression",
      width: 180,
    },
    {
      field: "number_of_post",
      headerName: "Post",
      width: 180,
    },
    {
      field: "number_of_reach",
      headerName: "Reach",
      width: 180,
    },
    {
      field: "number_of_story_views",
      headerName: "Story Views",
      width: 180,
    },
    {
      field: "number_of_views",
      headerName: "Views",
      width: 180,
    },
    {
      field: "operation_remark",
      headerName: "Opreation Remark",
      width: 180,
    },

    {
      field: "platform_name",
      headerName: "Platform",
      width: 180,
    },
    {
      field: "public_usage",
      headerName: "Public usage",
      width: 180,
    },
    {
      field: "feedback",
      headerName: "feedback",
      width: 180,
    },

    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "30px" }}>
          <BorderColorIcon
            onClick={() => navigate(`/casestudy-update/${params.row.data_id}`)}
            color="primary"
            style={{ cursor: "pointer" }}
          />

          <DeleteButton
            endpoint="dataoperationwithdataname"
            id={params.row.data_name}
            getData={getData}
          />
        </div>
      ),
    },
  ]);
  console.log(backupData, "backupData");

  const [resizingColumn, setResizingColumn] = React.useState(null);
  const [startX, setStartX] = React.useState(null);
  const handleMouseDown = (e, field) => {
    setResizingColumn(field);
    setStartX(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (resizingColumn !== null && startX !== null) {
      const deltaX = e.clientX - startX;
      handleResize(resizingColumn, deltaX);
      setStartX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    setResizingColumn(null);
    setStartX(null);
  };
  const handleResize = (field, deltaX) => {
    const columnIndex = columns.findIndex((col) => col.headerName === field);
    const newColumns = [...columns];
    newColumns[columnIndex] = {
      ...newColumns[columnIndex],
      width: newColumns[columnIndex].width + deltaX,
    };
    setColumns(newColumns);
  };
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingColumn, startX]);
  const ResizableHeader = ({ field, width }) => (
    <div
      style={{ width: width + "px", cursor: "col-resize" }}
      onMouseDown={(e) => handleMouseDown(e, field)}
    >
      {field}
    </div>
  );
  const resizableColumns = columns.map((col) => ({
    ...col,
    headerAlign: "center",
    renderHeader: (params) => (
      <ResizableHeader field={col.headerName} width={params.colDef.width} />
    ),
  }));
  console.log(brandCategory, "brandCat", brandSubCatData)
  return (
    <>
      {console.log("datagrid rendered")}
      {brandCategory.length > 0 && brandSubCatData.length > 0 &&

        <DataGrid
          rows={newData}
          columns={resizableColumns}
          pageSize={5}
          getRowId={(row) => row._id}
          initialState={{
            // sorting: {
            //   sortModel: [{ field: "brand_name", sort: "desc" }],
            // },
          }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            panel: {
              anchorEl: filterButtonEl,
            },
            toolbar: {
              setFilterButtonEl,
            },
          }}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
        />}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            alignContent: "center",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            width: "50%",
            height: [enlargedFileType === "pdf" ? "100vh" : "auto"],
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {renderEnlargedContent()}
      </Modal>
    </>
  );
};

export default CasestudyTabulerData;
