import CampaignDetails from "./CampaignDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PageDetaling from "./PageDetailing";
import { DataGrid } from "@mui/x-data-grid";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";

import {
  Paper,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

let options = [];
let text;
let timer;
const PlanCreation = () => {
  const param = useParams();
  const id = param.id;

  const [allPageData, setAllPageData] = useState([]);
  const [filterdPages, setFilteredPages] = useState([]);
  const [searchedPages, setSearchedPages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [searched, setSearched] = useState(false);
  const [campaignName, setCampaignName] = useState(null);
  const [remainingPages, setRemainingPages] = useState([]);
  const [modalSearchPage, setModalSearchPage] = useState([]);
  const [modalSearchPageStatus, setModalSearchPageStatus] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [postpage, setPostPage] = useState(0);
  const [payload, setPayload] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  //copy paste states

  const [isModalOpenCP, setIsModalOpenCP] = useState(false);

  const Follower_Count = [
    "<10k",
    "10k to 100k ",
    "100k to 1M ",
    "1M to 5M ",
    ">5M ",
  ];
  const page_health = ["Active", "nonActive"];

  //to fetch all pages
  const getPageData = async () => {
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPageData(pageData.data.body);
    setFilteredPages(pageData.data.body);
    setPayload(pageData.data.body);
    // setSearchedPages(pageData.data.body)
  };

  //to call getPageData function
  useEffect(() => {
    getPageData();
  }, []);

  useEffect(() => {
    const remainingData = allPageData?.filter(
      (item) =>
        !filterdPages.some((selectedItem) => selectedItem.p_id == item.p_id)
    );
    setRemainingPages(remainingData);
  }, [filterdPages]);
  // console.log(remainingPages);
  //this function will feed the category data to categories option array
  const categorySet = () => {
    allPageData.forEach((data) => {
      if (!options.includes(data.cat_name)) {
        // setOptions([...options, data.cat_name])
        options.push(data.cat_name);
      }
    });
  };
  //whenever a pageData is available call categoryset function
  useEffect(() => {
    if (allPageData?.length > 0) {
      categorySet();
    }
  }, [allPageData]);

  //useEffect for category selection change events
  useEffect(() => {
    if (selectedCategory.length > 0 && selectedFollower) {
      //if there is a selected category and selected follower
      const page = allPageData.filter((pages) => {
        //based on the selected follower a condition will be executed

        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            //if there is category selected then this
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            //if there is no category selected
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }
        // ok;
        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      //to set the filtered page
      setFilteredPages(page);
      setPayload(page)
    } else if (selectedCategory.length > 0 && !selectedFollower) {
      //in case category is present but follower count is not selected
      const page = allPageData.filter((pages) => {
        return selectedCategory.includes(pages.cat_name);
      });
      setFilteredPages(page);
      setPayload(page)
      // setSelectedFollower(null)
    } else if (selectedCategory.length == 0 && !selectedFollower) {
      setFilteredPages(allPageData);
      setPayload(allPageData)
    } else if (selectedCategory.length == 0 && selectedFollower) {
    }
  }, [selectedCategory]);

  // useEffect(()=>{

  //   setSearchedPages(filterdPages)
  // },[filterdPages])

  //useEffect for follower selection change events
  useEffect(() => {
    //
    if (selectedFollower) {
      const page = allPageData.filter((pages) => {
        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }
        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      setFilteredPages(page);
      setPayload(page)
    } else {
      if (selectedCategory.length > 0) {
        const page = allPageData.filter((pages) => {
          return selectedCategory.includes(pages.cat_name);
        });
        setFilteredPages(page);
        setPayload(page)
      } else setFilteredPages(allPageData);
    }
  }, [selectedFollower]);

  //this functin will be called whenever category is changed
  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
    setPostPage(0);
  };

  //this functin will be called whenever follower count is changed
  const followerChangeHandler = (e, op) => {
    setSelectedFollower(op);
  };

  
  const handleSearchChange = (e) => {
    if (!e.target.value.length == 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const searched = payload.filter((page) => {
          return (
            page.page_name
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            page.cat_name.toLowerCase().includes(e.target.value.toLowerCase())
          );
        });

        // console.log(searched);
        // setSearchedPages(searched);
        setSearched(true);
        setFilteredPages(searched)
      }, 500);
    } else {
      // console.log("empty");
      setSearched(false);
      setFilteredPages(payload)
      clearTimeout(timer);
      // if(e.targe)
    }
  };

  const getCampaignName = (data, cmpName) => {
    setCampaignName(cmpName);
    // console.log(cmpName)
  };
  // console.log(allPageData)
  // console.log(selectedFollower);

  //all logic related to add new page modal

  // console.log(isModalOpen, "dasdas");
  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSeachChangeModal = (e) => {
    if (!e.target.value.length == 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const searched = remainingPages.filter((page) => {
          return (
            page.page_name
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            page.cat_name.toLowerCase().includes(e.target.value.toLowerCase())
          );
        });
        setModalSearchPage(searched);
        setModalSearchPageStatus(true);
      }, 500);
    } else {
    }
  };

  const handleModalPageAdd = () => {
    const selectedRowData = selectedRows.map((rowId) =>
      remainingPages.find((row) => row.p_id === rowId)
    );
    // console.log(selectedRowData);
    setFilteredPages([...filterdPages, ...selectedRowData]);
    setPayload([...filterdPages, ...selectedRowData]);
    setModalSearchPageStatus(false);
    setIsModalOpen(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  //logic related to copy and paste

  const handleCP = () => {
    setIsModalOpenCP(true);
  };

  const handleCloseCP = () => {
    setIsModalOpenCP(false);
  };

  const [CPInput, setCPInput] = useState("");

  const handleInputChange = (e) => {
    text = e.target.value;
  };
  const handleModalPageCP = () => {
    // console.log(text.split(/\s+/));
    const pageInfo = text.split(/\s+/);
    let x = [];
    const remainingData = allPageData.filter((item) =>
      pageInfo.some((selectedItem) => {
        if (selectedItem === item.page_name) {
          x.push(selectedItem);
          return selectedItem === item.page_name;
        }
      })
    );
    const differenceArray = pageInfo.filter((element) => !x.includes(element));
    const falsepage = differenceArray.map((element) => {
      let pid = allPageData.length + Math.floor(Math.random() * 1000) + 1;
      return { page_name: element, status: false, p_id: String(pid) };
    });
    setFilteredPages([...remainingData, ...falsepage]);
    setPayload([...remainingData, ...falsepage]);
    // console.log(x);
    // console.log(differenceArray);
    // console.log(remainingData);
  };

  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  //copy paste logic ends here

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = remainingPages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "pages",
      width: 150,
      editable: true,
    },
    {
      field: "follower_count",
      headerName: "follower",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "cat_name",
      width: 150,
      editable: true,
    },
    {
      field: "post_page",
      headerName: "post / page",
      width: 150,
      renderCell: (params) => {
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            value={params.row.postPerPage}
          />
        );
      },
    },
    {
      field: "platform",
      headerName: "vender",
      width: 150,
      editable: true,
    },
  ];

  const payloadChangeOnSearchChangeInPageDetailing=(pl)=>{
    setPayload(pl)
  }
console.log(filterdPages)
  return (
    <>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Plan Creation</h2>
        </div>
      </div>
      <CampaignDetails cid={id} getCampaign={getCampaignName} />

      <Paper sx={{ display: "flex", justifyContent: "space-around" }}>
        <Autocomplete
          multiple
          id="combo-box-demo"
          options={options}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Category" />}
          onChange={categoryChangeHandler}
        />
        <Autocomplete
          id="combo-box-demo"
          options={Follower_Count}
          getOptionLabel={(option) => option}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Follower Count" />
          )}
          onChange={followerChangeHandler}
        />
        <Autocomplete
          id="combo-box-demo"
          options={page_health}
          getOptionLabel={(option) => option}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Page health" />
          )}
        />
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearchChange}
        />
        <Box>
          <Button variant="contained" onClick={handleCP} sx={{ m: 1 }}>
            Copy / paste
          </Button>
          <Button variant="contained" onClick={handleClick} sx={{ m: 1 }}>
            Add More Pages
          </Button>
        </Box>
      </Paper>
      <PageDetaling
        realPageData={allPageData}
        pageName={"planCreation"}
        pages={filterdPages}
        search={searched}
        searchedpages={searchedPages}
        setPostPage={setPostPage}
        postpage={postpage}
        setFilteredPages={setFilteredPages}
        data={{ campaignId: id, campaignName }}
        payload={payload}
        payloadChange={payloadChangeOnSearchChangeInPageDetailing}
      />
      <>
        <Dialog open={isModalOpenCP}>
          <DialogTitle>Add Pages</DialogTitle>
          <DialogContent>
            <Box sx={{ height: "100%" }}>
              <Textarea
                onChange={handleInputChange}
                style={{ color: "green", fontSize: "20px" }}
                aria-label="minimum height"
                minRows={6}
                placeholder="copy paste here..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCP} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={handleModalPageCP}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isModalOpen}>
          <DialogTitle>Add more Pages</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: "100%" }}>
              <TextField
                label="Search"
                variant="outlined"
                // value={searchText}
                onChange={handleSeachChangeModal}
                style={{ margin: "10px" }}
              />
              {modalSearchPageStatus ? (
                <DataGrid
                  rows={modalSearchPage || []}
                  columns={columns}
                  getRowId={(row) => row.p_id}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  onRowSelectionModelChange={(row) =>
                    handleSelectionChange(row)
                  }
                  rowSelectionModel={selectedRows.map((row) => row)}
                />
              ) : (
                <DataGrid
                  rows={remainingPages || []}
                  columns={columns}
                  getRowId={(row) => row.p_id}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  onRowSelectionModelChange={(row) =>
                    handleSelectionChange(row)
                  }
                  rowSelectionModel={selectedRows.map((row) => row)}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={handleModalPageAdd}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};

export default PlanCreation;
