import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import FormContainer from "../../FormContainer";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Button, Modal } from "@mui/material";
import { baseUrl } from "../../../../utils/config";

// var desturctureData;
const ExpertiesOverview = () => {
  const [getExpertiesData, setGetExpertiesData] = useState([]);

  // const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const [expertieareadata, setExpertieAreaData] = useState([]);
  // console.log(getExpertiesData?.area_of_expertise[0], "expertieareadata");
  const [platform, setPlatform] = useState([]);
  const [followercount, setFollowerCount] = useState([]);
  const [areaofexp, setAreaofexp] = useState();
  const handleOpen2 = (params) => {
    console.log(params);
    setOpen2(true);
    setExpertieAreaData(params.row.area_of_expertise.category);
    setFollowerCount(params.row.area_of_expertise.follower_count);
    setPlatform(params.row.area_of_expertise.platform);
    const maxLength = Math.max(...Object.values(params.row.area_of_expertise).map(arr => arr.length));
    const keys = Object.keys(params.row.area_of_expertise);

    const transformedData = Array.from({ length: maxLength }, (_, index) => {

      let obj = { id: index };


      keys.forEach(key => {
        obj[key] = params.row.area_of_expertise[key][index] || null;
      });

      return obj;
    });
    setAreaofexp(transformedData);
  };
  console.log(areaofexp, "lol");

  const handleClose2 = () => setOpen2(false);

  const ExpertiesData = async () => {
    const Experties = await axios.get(baseUrl + "expertise");
    const setexdata = Experties.data.data;
    console.log(setexdata[0].area_of_expertise?.category.length, "expert data");
    setGetExpertiesData(setexdata);
  };

  useEffect(() => {
    ExpertiesData();
  }, []);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "10px",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  const handleDelete = (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}` + `expertise/${userId}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
              ExpertiesData();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = getExpertiesData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exp_name",
      headerName: "Expert Name",
      width: 180,
      sortable: true,
    },
    {
      field: "action",
      headerName: "Area Of Expertise",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button className="icon-1" onClick={() => handleOpen2(params)} variant="text">
              <i className="bi bi-chat-left-text"></i>
            </button>
          </div>
        );
      },
    },
    {
      field: "categoryCount",
      headerName: "Category Count",
      width: 150,
      renderCell: (params) => {
        const categoryCount =
          params.row.area_of_expertise?.category.length || 0;
        return <div>{categoryCount}</div>;
      },
    },
    {
      field: "plateCount",
      headerName: "Platform Count",
      width: 150,
      renderCell: (params) => {
        const plateCount = params.row.area_of_expertise?.platform.length || 0;
        return <div>{plateCount}</div>;
      },
    },

    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          {/* {console.log(params.row,"vijjj")} */}
          <Link to={`/admin/expeties-update/${params.row.exp_id}`}>
            <div className="icon-1">
              <i className="bi bi-pencil"></i>
            </div>
          </Link>

          <div className="icon-1"
            onClick={() => handleDelete(params.row.user_id)}>
            <i className="bi bi-trash"></i>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Expert Overview"
        link="/admin/experties"
        buttonAccess={true}
      />
      {/* <div className="card">
        <div className="card-header">
          <div className="data_tbl" style={{ height: "64vh", width: "100%" }}>
            <div className="card-body body-padding">

              <DataGrid
                rows={getExpertiesData}
                columns={columns}
                getRowId={(row) => row.exp_id}
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="card">
        <div className="card-body body-padding fx-head thm_table">

          <DataGrid
            rows={getExpertiesData}
            columns={columns}
            getRowId={(row) => row.exp_id}
          />

        </div>
      </div>
      {/* {console.log(areaofexp)} */}
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <div className="fx-head thm_table">


          <DataGrid
            rows={areaofexp}
            columns={[{
              field: "S.NO",
              headerName: "S.NO",
              width: 90,
              renderCell: (params) => {
                const rowIndex = areaofexp.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
              }

            },
            {
              field: "category",
              headerName: "Category",
              width: 180,
              sortable: true,
            },
            {
              field: "followers Count",
              headerName: "Followers Count",
              width: 180,
              sortable: true,
            },
            {
              field: "Platform",
              headerName: "Platform",
              width: 180,
              sortable: true,
            },
            ]}
            getRowId={(row) => row.id}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ExpertiesOverview;
