import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import {
  TextField,
  Button,
  DialogActions,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { Paper, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

let options = [];
const PageDetaling = ({
  pageName,
  realPageData,
  pages,
  search,
  searchedpages,
  data,
  setFilteredPages,
  phaseInfo,
  setPhaseDataError,
  payload,
  payloadChange,
  // setPostPage,
  // postpage,
}) => {
  const { toastAlert, toastError } = useGlobalContext();

  const navigate = useNavigate();
  const [allPages, setAllPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingPageId, setDeletingPageId] = useState(null);
  const [remainingPages, setRemainingPages] = useState([]);
  const [smallPostPerPage, setSmallPostPerPage] = useState(
    Number.MAX_SAFE_INTEGER
  );

  console.log(pages);

  useEffect(() => {
    if (pages?.length > 0) {
      const addPost = pages.map((page) => {
        if (!page.postPerPage) {
          return { ...page, postPerPage: 0 };
        } else return page;
      });
      setAllPages([...addPost]);
      const differenceArray = realPageData?.filter((element) => {
        if (!pages.includes(element)) {
          options.push(element.page_name);
          return !pages.includes(element);
        }
      });
      setRemainingPages(differenceArray);
    }
  }, [pages]);

  useEffect(() => {
    if (pageName == "phaseCreation") {
      let smallest = Number.MAX_SAFE_INTEGER;
      console.log(pages);
      pages.forEach((page) => {
        if (Number(page.postRemaining) < smallest) {
          smallest = Number(page.postRemaining);
        }
      });
      // console.log(smallest)
      setSmallPostPerPage(smallest);
    }
  }, [pages]);

  const pageReplacement = (e, params, index) => {
    // console.log(e.target.innerText,params,index)

    const pageReplacement = realPageData.find((page) => {
      return page.page_name == e.target.innerText;
    });
    // console.log(pageReplacement)
    const z = [...allPages];
    z.splice(index, 1, pageReplacement);
    // console.log(z)
    setAllPages(z);
  };

  const handlePostPerPageChange = (e, params) => {
    let updatedValue = e.target.value;
    if (e.target.value > Number(params.row.postRemaining)) {
      updatedValue = params.row.postRemaining;
    }

    // Check if the input value is being set or cleared
    if (updatedValue !== params.value || updatedValue === "") {
      const updatedPages = allPages.map((page) =>
        page.p_id === params.row.p_id
          ? { ...page, postPerPage: updatedValue, value: null }
          : page
      );
      console.log(updatedPages);
      setAllPages(updatedPages);
      const x = payload.map((page) => {
        if (page.p_id === params.row.p_id) {
          return { ...page, postPerPage: updatedValue };
        } else return page;
      });
      if (pageName == "planCreation") {
      }
      // console.log(x)
      payloadChange(x, updatedPages);
      // setFilteredPages(x)
    }
  };
  // console.log(payload)
  console.log(pages);
  console.log(allPages);
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = allPages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Pages",
      width: 150,
      editable: true,
      renderCell: (params) => {
        // console.log(params)
        return params?.row?.status == false ? (
          <Autocomplete
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option}
            sx={{ width: 300 }}
            renderInput={(param) => (
              // console.log(params)
              <TextField {...param} label={params.row.page_name} />
            )}
            onChange={(e) =>
              pageReplacement(e, params.row, allPages.indexOf(params.row))
            }
          />
        ) : (
          params.page_name
        );
      },
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },
    {
      field: "post_page",
      headerName: "Post / Page",
      width: 150,

      renderCell: (params) => {
        // params.value=params.row.postPerPage
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            value={
              params.row.postPerPage !== null
                ? params.row.postPerPage
                : params.value || ""
            }
            placeholder={params.row.postPerPage || ""}
            onChange={(e) => handlePostPerPageChange(e, params)}
          />
        );
      },
    },
    {
      field: "remainingPages",
      headerName: "remainingPages",
      width: 150,
      renderCell: (params) => {
        // params.value=params.row.postPerPage
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            // value={}
            disabled
            placeholder={params.row.postRemaining}
          />
        );
      },
    },
    // {
    //   field: "platform",
    //   headerName: "vender",
    //   width: 150,
    //   editable: true,
    // },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return (
          <Button onClick={() => removePage(params)}>
            {" "}
            <DeleteIcon />
          </Button>
        );
      },
    },
  ];

  const removePage = (params) => {
    setOpenDialog(true);
    setDeletingPageId(params.id);
  };
  const confirmDelete = () => {
    const newData = allPages.filter((page) => page.p_id != deletingPageId);
    setFilteredPages(newData);
    setOpenDialog(false);
  };
  const handlePost = (e) => {
    let updatedValue = e.target.value;
    console.log(smallPostPerPage);
    if (e.target.value >= smallPostPerPage) {
      updatedValue = smallPostPerPage;
    }

    const postperpage = allPages.map((page) => {
      return { ...page, postPerPage: updatedValue };
    });

    setAllPages(postperpage);
    payloadChange(postperpage, postperpage);
    // payloadChange(postperpage);
    // setPostPage(Number(e.target.value));
  };

  // console.log(allPages);

  const submitPlan = async (e) => {
    if (pageName == "planCreation") {
      const planName = data.campaignName + "plan";

      const newdata = {
        planName,
        campaignName: data.campaignName,
        campaignId: data.campaignId,
        pages: allPages,
      };
      try {
        const result = await axios.post(
          baseUrl+"campaignplan",
          newdata
        );
        // console.log(result);
        toastAlert("Plan Created SuccessFully");
        setTimeout(() => {
          navigate("/admin/registered-campaign");
        }, 2000);
      } catch (error) {
        toastError("Plan not Created");
      }
    }
    if (pageName == "phaseCreation") {
      // console.log("phase creation")
      if (phaseInfo.phaseDataError === "") {
        setPhaseDataError("Phase ID is Required");
      }
      const planName = data.campaignName + "plan";
      e.preventDefault();
      const finalPages = allPages.map((page) => {
        return {
          ...page,
          postRemaining: page.postRemaining - page.postPerPage,
        };
      });
      const newdata = {
        planName,
        campaignName: data.campaignName,
        campaignId: data.campaignId,
        pages: finalPages,
        phaseName: phaseInfo.phaseName,
        desciption: phaseInfo.description,
        commitment: phaseInfo.commitment,
      };
      try {
        const result = await axios.post(
          baseUrl+"campaignphase",
          newdata
        );
        // console.log(result);
        toastAlert("Plan Created SuccessFully");
        setTimeout(() => {
          navigate("/admin/registered-campaign");
        }, 2000);
      } catch (error) {
        toastError("Plan not Created");
      }
    }
  };
  // console.log(allPages);
  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <TextField
          id="outlined-basic"
          InputLabelProps={{ shrink: true }}
          label="Post/pages"
          variant="outlined"
          // value={postpage}
          onChange={handlePost}
        />
      </Box>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={allPages || []}
          columns={columns}
          getRowId={(row) => row.p_id}
          pageSizeOptions={[5]}
          getRowClassName={(params) => {
            return params.row.status == false ? "unavailable" : "available";
          }}
          sx={{
            ml: 2,
            ".unavailable": {
              bgcolor: " #FF4433",
              "&:hover": {
                bgcolor: "#E30B5C",
              },
            },
          }}
        />
      </Box>
      {!search && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 4 }}
            onClick={submitPlan}
          >
            submit
          </Button>{" "}
        </div>
      )}
      <>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Remove Page</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Remove this page?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="outlined" color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Paper>
  );
};

export default PageDetaling;
