import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Typography } from "@mui/material";
import { SnippetFolderTwoTone } from "@mui/icons-material";
import {baseUrl} from '../../../utils/config'

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Review() {
  const [value, setValue] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [contentSectionId, setContentSectionId] = useState();
  const [text, setText] = useState("");

  const [rows, setRows] = useState([]);
  const [content, setContent] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [verifid, setVerifid] = useState([]);
  const [reject, setReject] = useState([]);
  const [enhancement, setEnhancement] = useState([]);

  const getData = () => {
    axios.get(baseUrl+"contentSectionReg").then((res) => {
      const data = res.data.data.filter(
        (e) => e.status == "22" && e.stage == 3
      );
      const verified = res.data.data.filter(
        (e) => e.status == "23" && e.stage == 4
      );
      const rejct = res.data.data.filter(
        (e) => e.status == "24" && e.stage == 3
      );
      const enhance = res.data.data.filter(
        (e) => e.status == "25" && e.stage == 3
      );
      setRows(data);
      setVerifid(verified);
      setReject(rejct);
      setEnhancement(enhance);

      console.log(data, "this is by contentSectionReg");
    });
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  function getContentType() {
    axios.get(baseUrl+"content").then((res) => {
      const data = res.data.data;
      setContent(data);
      console.log(data, "this is by content");
    });
  }
  const getBrand = () => {
    axios.get(baseUrl+"get_brands").then((res) => {
      const data = res.data.data;
      setBrandName(data);
      console.log(data, "this is by saimyual");
    });
  };
  useEffect(() => {
    getData();
    getContentType();
    getBrand();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tab1Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
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
      field: "content_type_id",
      headerName: "content Type",
      width: 200,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: " Remark",
      width: 200,
    },
    {
      field: "cmpAdminDemoLink",
      headerName: "Link",
      width: 300,
      renderCell: (params) => {
        return (
          <a
            href={params.row.cmpAdminDemoLink}
            target="_blank"
            rel="noreferrer"
          >
            {params.row.cmpAdminDemoLink}
          </a>
        );
      },
    },
    {
      field: "downloadCmpAdminDemoFile",
      headerName: "File",
      renderCell: (params) => {
        return (
          <a
            href={params.row.downloadCmpAdminDemoFile}
            target="_blank"
            rel="noreferrer"
          >
            <SnippetFolderTwoTone color="primary" />
          </a>
        );
      },
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$1/$2/$3 $4");
      },
    },
  ];

  const verifidColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = verifid.indexOf(params.row);
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
      field: "content_type_id",
      headerName: "content Type",
      width: 200,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: " Remark",
      width: 200,
    },

    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$1/$2/$3 $4");
      },
    },
    {
      field: "cmpAdminDemoLink",
      headerName: "Link",
      width: 300,
      renderCell: (params) => {
        return (
          <a
            href={params.row.cmpAdminDemoLink}
            target="_blank"
            rel="noreferrer"
          >
            {params.row.cmpAdminDemoLink}
          </a>
        );
      },
    },
    {
      field: "downloadCmpAdminDemoFile",
      headerName: "File",
      renderCell: (params) => {
        return (
          <a
            href={params.row.downloadCmpAdminDemoFile}
            target="_blank"
            rel="noreferrer"
          >
            <SnippetFolderTwoTone color="primary" />
          </a>
        );
      },
    },
  ];

  const rejectColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = reject.indexOf(params.row);
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
      field: "content_type_id",
      headerName: "content Type",
      width: 200,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: " Remark",
      width: 200,
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$1/$2/$3 $4");
      },
    },
    {
      field: "cmpAdminDemoLink",
      headerName: "Link",
      width: 300,
      renderCell: (params) => {
        return (
          <a
            href={params.row.cmpAdminDemoLink}
            target="_blank"
            rel="noreferrer"
          >
            {params.row.cmpAdminDemoLink}
          </a>
        );
      },
    },
    {
      field: "downloadCmpAdminDemoFile",
      headerName: "File",
      renderCell: (params) => {
        return (
          <a
            href={params.row.downloadCmpAdminDemoFile}
            target="_blank"
            rel="noreferrer"
          >
            <SnippetFolderTwoTone color="primary" />
          </a>
        );
      },
    },
  ];
  const handleAccept = (params) => {
    console.log(params.row);
    setContentSectionId(params.row.content_section_id);

    setOpen2(true);
  };
  const handleBackSubmit = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl+"contentSectionReg", {
        content_section_id: contentSectionId,
        creator_remark: text,
        // stage: 3,
        // status: "22",
        stage: 2,
        status: "11",
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          handleClose();
          getData();
        }
      });

    setOpen2(false);
  };
  const enhancementColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = enhancement.indexOf(params.row);
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
      field: "content_type_id",
      headerName: "content Type",
      width: 200,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: " Remark",
      width: 200,
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$1/$2/$3 $4");
      },
    },
    {
      field: "cmpAdminDemoLink",
      headerName: "Link",
      width: 300,
      renderCell: (params) => {
        return (
          <a
            href={params.row.cmpAdminDemoLink}
            target="_blank"
            rel="noreferrer"
          >
            {params.row.cmpAdminDemoLink}
          </a>
        );
      },
    },
    {
      field: "downloadCmpAdminDemoFile",
      headerName: "File",
      renderCell: (params) => {
        return (
          <a
            href={params.row.downloadCmpAdminDemoFile}
            target="_blank"
            rel="noreferrer"
          >
            <SnippetFolderTwoTone color="primary" />
          </a>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAccept(params)}
              sx={{ fontSize: "20px", marginRight: "8px" }}
            >
              Submission
            </Button>
          </Box>
        );
      },
    },
  ];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: "10px",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  const handleClose = () => setOpen2(false);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Pending" {...a11yProps(0)} />
            <Tab label="Verified" {...a11yProps(1)} />
            <Tab label="Rejected" {...a11yProps(2)} />
            <Tab label="Enhancement" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <DataGrid
            rows={rows}
            columns={tab1Columns}
            pageSize={5}
            getRowId={(row) => row.content_section_id}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <DataGrid
            rows={verifid}
            columns={verifidColumns}
            pageSize={5}
            getRowId={(row) => row.content_section_id}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <DataGrid
            rows={reject}
            columns={rejectColumns}
            pageSize={5}
            getRowId={(row) => row.content_section_id}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <DataGrid
            rows={enhancement}
            columns={enhancementColumns}
            pageSize={5}
            getRowId={(row) => row.content_section_id}
          />
        </CustomTabPanel>
      </Box>

      <Modal
        open={open2}
        onClose={handleClose}
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
            submit to admin
          </Typography>
          {/* <Typography>Date & time : {extendDeliveryDate}</Typography> */}
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            label="Outlined"
            variant="outlined"
            placeholder="Remark here"
            name="text"
            value={text}
            onChange={handleTextChange}
            style={{ width: "100%", marginTop: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
            onClick={handleBackSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
