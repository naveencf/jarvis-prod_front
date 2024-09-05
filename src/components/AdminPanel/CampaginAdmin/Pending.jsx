import React, { useRef } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import PropTypes from "prop-types";
import Rejected from "./Rejected";
import TerminatedReq from "./TerminatedReq";
import { useEffect } from "react";
import axios from "axios";
import ExtendRequest from "./ExtendRequest";
import { SnippetFolderTwoTone } from "@mui/icons-material";
import MultipleAssignDialog from "./MultipleAssignDialog";
import SingleAssignDialog from "./SingleAssignDialog";
import { baseUrl } from "../../../utils/config";

export default function Pending() {
  const [reload, setReoad] = useState(false);
  const [modalNotEditable, setModalNotEditable] = useState({});
  const [open, setOpen] = React.useState(false);
  const [openMultipleAssignModal, setOpenMultipleAssignModal] = useState(false);
  const [assignToList, setAssignToList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTable1Data, setShowTable1Data] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [contentTypeList, setContentTypeList] = useState([]);
  const [commitmentModalData, setCommitmentModalData] = useState([{}]);
  const [commits, setCommits] = useState([]);
  const [brandIdList, setBrandIdList] = useState([]);
  const [showBundelData, setShowBundelData] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showMultipleAssignModalData, setShowMultipleAssignModalData] =
    useState([]);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = (params) => {
    setCommitmentModalData(params.row.commitment);
    setOpen2(true);
  };
  const handleClose2 = () => setOpen2(false);
  const setAssignTo = useRef("");

  const handleCheckBox = (params) => {};
  const handleGetRowData = (row) => {
    const data = showTable1Data.filter(
      (e) => e.status == 1 && e.stage == 1 && e.brand_id == row
    );
    setShowTable1Data(data);
    setShowBundelData(true);
  };

  const handleOpenMultipleAssignModal = () => {
    const data = showTable1Data.filter((e) => {
      return rowSelectionModel.includes(e.content_section_id);
    });
    setOpenMultipleAssignModal(true);
    setShowMultipleAssignModalData(data);
  };

  const handleBack = () => {
    setShowBundelData(false);
    setReoad(!reload);
  };

  useEffect(() => {
    axios.get(baseUrl + "contentSectionReg").then((response) => {
      // const data = response.data.data.filter(
      //   (e) => e.status == "1" && e.stage == "1"
      // );
      // const arr = [];
      // console.log(data, "data");
      // const brandIdList = new Set(data.map((e) => e.brand_id));
      // arr.push(...brandIdList);
      // setBrandIdList(arr);
      // setShowTable1Data(data);

      const data = response.data.data.filter(
        (e) => e.status == "1" && e.stage == "1"
      );
      const arr = [];
      const brandIdList = new Set(response.data.data.map((e) => e.brand_id));
      arr.push(...brandIdList);
      setBrandIdList(arr);
      setShowTable1Data(response.data.data);
    });

    axios
      .get(baseUrl + "get_brands")
      .then((response) => {
        setBrandName(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(baseUrl + "content").then((response) => {
      setContentTypeList(response.data.data);
    });
    axios.get(baseUrl + "get_all_commitments").then((response) => {
      const data = response.data.data;

      setCommits(data);
    });
    axios.get(baseUrl + "get_all_users").then((response) => {
      const data = response.data.data.filter((e) => e.dept_id == 13);
      setAssignToList(data);
    });
  }, []);

  useEffect(() => {
    axios.get(baseUrl + "contentSectionReg").then((response) => {
      setShowBundelData(false);
      // const data = response.data.data.filter(
      //   (e) => e.status == "1" && e.stage == "1"
      // );
      // const arr = [];
      // console.log(data, "data");
      // const brandIdList = new Set(data.map((e) => e.brand_id));
      // arr.push(...brandIdList);
      // setBrandIdList(arr);
      // setShowTable1Data(data);

      const data = response.data.data.filter(
        (e) => e.status == "1" && e.stage == "1"
      );
      const arr = [];
      const brandIdList = new Set(response.data.data.map((e) => e.brand_id));
      arr.push(...brandIdList);
      setBrandIdList(arr);
      setShowTable1Data(response.data.data);
    });
  }, [reload]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "10px",
    transform: "translate(-40%, -50%)",
    width: "80vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };
  const handleOpen = (params) => {
    setModalNotEditable(params.row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleCloseMultipleAssignModal = () =>
    setOpenMultipleAssignModal(false);

  const brandColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = brandIdList.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "brand_name",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        const data = brandName.filter((e) => {
          return e.brand_id == params.row;
        })[0];
        return (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => handleGetRowData(params.row)}
            className="text-primary link "
          >
            {data?.brand_name}
          </p>
        );
      },
    },
    {
      field: "value",
      headerName: "Pending",
      width: 150,
      renderCell: (params) => {
        // const data = showTable1Data.filter((e) => e.status == 1 && e.stage == 1 && e.brand_id == params.row.brand_id).length;

        const data = showTable1Data.filter(
          (e) => e.status == 1 && e.stage == 1 && e.brand_id == params.row
        );

        return data.length;
      },
    },
    {
      field: "assigned",
      headerName: "Assigned",
      width: 150,
      renderCell: (params) => {
        const assignedCount =
          showTable1Data.filter((e) => e.brand_id === params.row).length -
          showTable1Data.filter(
            (e) => e.status == 1 && e.stage == 1 && e.brand_id === params.row
          ).length;

        return assignedCount;
      },
    },

    {
      field: "ContentCount",
      headerName: "Content Count",
      width: 150,
      renderCell: (params) => {
        const data = showTable1Data.filter((e) => params.row == e.brand_id);
        return showTable1Data.filter((e) => params.row == e.brand_id).length;
      },
    },
  ];

  const tab1Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = showTable1Data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "brand_id",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        return brandName.filter((e) => {
          return e.brand_id == params.row.brand_id;
        })[0]?.brand_name;
      },
    },
    {
      field: "brnad_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$3/$2/$1 $4");
      },
    },

    {
      field: "content_type_id",
      headerName: "Content Type",
      width: 150,
      renderCell: (params) => {
        const matchingContentType = contentTypeList.find((e) => {
          return params.row?.content_type_id === e?.content_type_id;
        });
        return matchingContentType?.content_type || "";
      },
    },
    {
      field: "campaign_brief",
      headerName: "Campaign Brief",
      width: 150,
    },
    {
      field: "content_brief",
      headerName: "Content Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.content_brief && <p>{params.row.content_brief}</p>;
      },
    },
    {
      field: "commits",
      headerName: "Commits",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    {
      field: "cmpAdminDemoLink",
      headerName: "Link",
      width: 300,
      renderCell: (params) => {
        return (
          params?.row.cmpAdminDemoLink && (
            <Button variant="text">
              <a
                href={params.row.cmpAdminDemoLink}
                target="_blank"
                rel="noreferrer"
              >
                {params.row.cmpAdminDemoLink}
              </a>
            </Button>
          )
        );
      },
    },
    {
      field: "downloadCmpAdminDemoFile",
      headerName: "File",
      renderCell: (params) => {
        return (
          params.row.downloadCmpAdminDemoFile && (
            <Button variant="text">
              <a href={params.row.downloadCmpAdminDemoFile}>
                <SnippetFolderTwoTone />
              </a>
            </Button>
          )
        );
      },
    },

    {
      field: "download_excel_file",
      headerName: "Excel Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <a href={params.row.download_excel_file}>
              <Button variant="text">
                <DownloadTwoToneIcon />
              </Button>
            </a>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Assign a Content Creator",
      renderCell: (params) => {
        return (
          <div className="d-flex text-center align-item-center justify-content-center">
            <Button type="button" onClick={() => handleOpen(params)}>
              <SendTwoToneIcon />
            </Button>
          </div>
        );
      },
      width: 200,
    },
  ];

  const commitColumns = [
    {
      field: "selectValue",
      headerName: "Commits",
      width: 200,
      renderCell: (params) => {
        return commits.filter((e) => {
          return e.cmtId == params.row.selectValue;
        })[0]?.cmtName;
      },
    },
    {
      field: "textValue",
      headerName: "Value",
      width: 150,
    },
  ];

  const innerTab1 = (
    <>
      {/* <DataGrid
        rows={showBundelData ? showTable1Data : brandIdList}
        columns={showBundelData ? tab1Columns : brandColumns}
        pageSize={10}
        getRowId={(row) => (showBundelData ? row.content_section_id : row)}
        checkboxSelection={showBundelData ? true : false}
        onRowClick={handleCheckBox}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      /> */}

      {showBundelData && (
        <DataGrid
          rows={showTable1Data}
          columns={tab1Columns}
          pageSize={10}
          getRowId={(row) => row.content_section_id}
          checkboxSelection={true}
          onRowClick={handleCheckBox}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      )}

      {!showBundelData && (
        <DataGrid
          rows={brandIdList}
          columns={brandColumns}
          pageSize={10}
          getRowId={(row) => row}
          checkboxSelection={false}
          onRowClick={handleCheckBox}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
        />
      )}

      <MultipleAssignDialog
        brandName={brandName}
        openMultipleAssignModal={openMultipleAssignModal}
        showMultipleAssignModalData={showMultipleAssignModalData}
        assignToList={assignToList}
        setAssignTo={setAssignTo}
        selectedDate={selectedDate}
        handleCloseMultipleAssignModal={handleCloseMultipleAssignModal}
        setReload={setReoad}
        reload={reload}
        setOpen={setOpen}
        handleClose={handleClose}
      />

      <SingleAssignDialog
        open={open}
        handleClose={handleClose}
        modalNotEditable={modalNotEditable}
        brandName={brandName}
        contentTypeList={contentTypeList}
        assignToList={assignToList}
        selectedDate={selectedDate}
        reload={reload}
        setReload={setReoad}
        handleDateChange={handleDateChange}
        setAssignTo={setAssignTo}
      />
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Commits
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
            <Paper sx={{ padding: "10px" }}>
              <div className="d-flex justify-content-between">
                <DataGrid
                  rows={commitmentModalData}
                  columns={commitColumns}
                  pageSize={10}
                  getRowId={(row) => row.selectValue}
                />
              </div>
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                onClick={handleClose2}
                color="primary"
              >
                Cancle
              </Button>
            </Paper>
          </Typography>
        </Box>
      </Modal>
    </>
  );

  const innerTab2 = <ExtendRequest ReloadMain={setReoad} />;
  const innerTab3 = <Rejected ReloadMain={setReoad} />;
  const innerTab4 = <TerminatedReq ReloadMain={setReoad} />;

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <div className="d-flex justify-content-between ">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="New" {...a11yProps(0)} />
            <Tab label="Extented Request" {...a11yProps(1)} />
            <Tab label="Reassign" {...a11yProps(2)} />
            <Tab label="Terminated" {...a11yProps(3)} />
          </Tabs>

          {showBundelData && (
            <Button onClick={handleBack} variant="outlined" sx={{ mb: 2 }}>
              Back
            </Button>
          )}
          {rowSelectionModel.length > 0 && showBundelData && (
            <Button
              onClick={handleOpenMultipleAssignModal}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Assign
            </Button>
          )}
        </div>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {innerTab1}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {innerTab2}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {innerTab3}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {innerTab4}
      </CustomTabPanel>
    </Box>
  );
}
