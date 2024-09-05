import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PiArrowBendDoubleUpRightBold,
  PiArrowBendDoubleUpLeftBold,
} from "react-icons/pi";
import Review from "./Review";
import axios from "axios";
import { SnippetFolderTwoTone } from "@mui/icons-material";
import { baseUrl } from '../../../utils/config'

export default function CreaterDashboard() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [rows, setRows] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [content, setContent] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [inputFields, setInputFields] = useState([
    { textValue: 1, file: null },
  ]);
  const [contentSectionId, setContentSectionId] = useState();
  const [acceptedData, setAcceptData] = useState();
  const [rejectData, setRejectData] = useState();
  const [submissionData, setSubmissionData] = useState();
  const [selectedContentType, setSelectedContentType] = useState("");
  const [compData, setCompData] = useState([]);
  const [extendDeliveryDate, setExtendDeliveryDate] = useState();
  const [text, setText] = useState("");
  const [startData, setStartData] = useState({
    selected: 1,
    selectedDate: new Date(),
    remark: "",
  });


  const getBrand = () => {
    axios.get(baseUrl + "get_brands").then((res) => {
      const data = res.data.data;
      setBrandName(data);

    });
  };
  function getContentType() {
    axios.get(baseUrl + "content").then((res) => {
      const data = res.data.data;
      setContent(data);

    });
  }
  const getData = () => {
    axios.get(baseUrl + "contentSectionReg").then((res) => {
      const pending = res.data.data.filter(
        (e) => e.status == "11" && e.stage == 2
      );
      const accept = res.data.data.filter(
        (e) => e.status == "21" && e.stage == 3
      );
      const reject = res.data.data.filter(
        (e) => e.status == "22" && e.stage == 2
      );
      const complete = res.data.data.filter(
        (e) => e.status == "23" && e.stage == 4
      );
      setRows(pending);
      setAcceptData(accept);
      setRejectData(reject);
      setCompData(complete);

    });
  };

  useEffect(() => {
    getData();
    getBrand();
    getContentType();
  }, []);

  const handleAddFields = () => {
    setInputFields([...inputFields, { value: "" }]);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index].file = event.target.files[0];
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleClose3 = () => setOpen3(false);
  const handleClose4 = () => setOpen4(false);
  const handleClose5 = () => setOpen5(false);

  const handleReject = (params) => {
    setContentSectionId(params.row.content_section_id);
    setOpen2(true);
  };
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStartData({
      ...startData,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setStartData({
      ...startData,
      selectedDate: newValue,
    });
  };

  const handleAccept = (params) => {
    setContentSectionId(params.row.content_section_id);
    setOpen(true);
  };
  const handleActive = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl + "contentSectionReg", {
        content_section_id: contentSectionId,
        creator_dt: startData.selectedDate,
        creator_remark: startData.remark,
        stage: 3,
        status: "21",
      })
      .then((response) => {

        if (response.data.success) {
          handleClose();
          getData();
        }
      });
    setOpen(false);
    setActiveAccordionIndex(1);
    setOpen(false);
  };
  const handleActiveReject = () => {
    axios
      .put(baseUrl + "contentSectionReg", {
        content_section_id: contentSectionId,
        creator_dt: startData.selectedDate,
        creator_remark: text,
        stage: 2,
        status: "22",
      })
      .then((response) => {

        if (response.data.success) {
          handleClose();
          getData();
        }
      });
    setActiveAccordionIndex(2);
    setOpen2(false);
  };

  const handleSubmission = async () => {
    for (const field of inputFields) {
      const formData = new FormData();
      formData.append("content_section_id", contentSectionId);
      formData.append("creator_dt", startData.selectedDate);
      formData.append("status", "22");
      formData.append("stage", 3);
      formData.append("content_sec_file", field.file);

      try {
        const response = await axios.put(
          baseUrl + "contentSectionReg",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          console.log('');
        } else {
          console.error(`Error sending data for ${field.textValue}`);
        }
      } catch (error) {
        console.error(
          `Error sending data for ${field.textValue}: ${error.message}`
        );
      }
    }
    setActiveAccordionIndex(4);
    setOpen3(false);
  };

  // Submission ++++++++++++++++++
  const handleSubmissionData = (params) => {

    setSelectedContentType(
      content.filter((e) => e.content_value === params.row.content_type_id)[0]
        ?.content_type
    );
    setContentSectionId(params.row.content_section_id); // Set contentSectionId in the state

    setSubmissionData(params.row);
    setOpen3(true);
  };
  // const handleSubmission = (e) => {
  //   e.preventDefault()
  //   axios
  //     .put(baseUrl+"contentSectionReg", {
  //       content_section_id: contentSectionId,
  //       creator_dt: startData.selectedDate,
  //       stage: 3,
  //       status: "22",
  //     }).then((response) => {
  //       if (response.data.success) {
  //         handleClose();
  //         setOpen3(false);
  //         getData();
  //       }
  //     })
  //   setActiveAccordionIndex(4)
  //   setOpen3(false);
  // };
  // ExtendDilvery ++++++++++++++++++
  const handleExtendDilvery = (params) => {
    setExtendDeliveryDate(params.row.creator_dt);
    setContentSectionId(params.row.content_section_id);
    setOpen4(true);
  };

  const handleExtend = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl + "contentSectionReg", {
        content_section_id: contentSectionId,
        creator_dt: extendDeliveryDate,
        creator_remark: text,
        stage: 3,
        status: "23",
      })
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setOpen4(false);
          getData();
        }
      });
  };
  // TerminateRequest ++++++++++++++++++
  const handleTerminateRequest = (params) => {
    setContentSectionId(params.row.content_section_id);
    setOpen5(true);
  };
  const handleTerminate = (e) => {
    e.preventDefault();
    axios
      .put(baseUrl + "contentSectionReg", {
        content_section_id: contentSectionId,
        creator_remark: text,
        stage: 2,
        status: "23",
      })
      .then((response) => {
        if (response.data.success) {
          handleClose();
          setOpen5(false);
          getData();
        }
      });
  };

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

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const tab2Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = acceptedData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "content_type_id",
      headerName: "Content Type",
      width: 150,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: "Remark",
      width: 150,
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 150,
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
      width: 500,
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
              onClick={() => handleSubmissionData(params)}
            >
              Submission
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleExtendDilvery(params)}
              style={{ marginRight: "8px" }}
            >
              Extends Delivery
            </Button>

            <Button
              type="button"
              variant="contained"
              color="success"
              onClick={() => handleTerminateRequest(params)}
            >
              Terminate Request
            </Button>
          </Box>
        );
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
      headerName: "Remark",
      width: 200,
    },
    {
      field: "brnad_dt",
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
            <Tooltip title="Accept" placement="top">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAccept(params)}
                sx={{ fontSize: "20px", marginRight: "8px" }}
              >
                {/* Accept */}
                <PiArrowBendDoubleUpRightBold />
              </Button>
            </Tooltip>
            <Tooltip title="Reject" placement="top">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleReject(params)}
                sx={{ fontSize: "20px" }}
                title="Reject"
              >
                {/* Reject */}
                <PiArrowBendDoubleUpLeftBold />
              </Button>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const tab3Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = rejectData.indexOf(params.row);
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
      headerName: "Remark",
      width: 150,
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
      width: 150,
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

  const tab4Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = compData.indexOf(params.row);
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
      headerName: "Content Type",
      width: 200,
      renderCell: (params) => {
        return content.filter((e) => {
          return e.content_value == params.row.content_type_id;
        })[0]?.content_type;
      },
    },
    {
      field: "creator_remark",
      headerName: "Remark",
      width: 200,
    },
    {
      field: "creator_dt",
      headerName: "Date & Time",
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
            color="primary"
          >
            <SnippetFolderTwoTone color="primary" />
          </a>
        );
      },
    },
  ];

  const tab1 = (
    // <ThemeProvider theme={theme}>
    <DataGrid
      rows={rows}
      columns={tab1Columns}
      pageSize={10}
      getRowId={(row) => row.content_section_id}
    />
    // </ThemeProvider>
  );
  const tab2 = (
    <DataGrid
      rows={acceptedData}
      columns={tab2Columns}
      pageSize={10}
      getRowId={(row) => row.content_section_id}
    />
  );
  const tab3 = (
    <DataGrid
      rows={rejectData}
      columns={tab3Columns}
      pageSize={10}
      getRowId={(row) => row.content_section_id}
    />
  );
  const tab4 = (
    <DataGrid
      rows={compData}
      columns={tab4Columns}
      pageSize={10}
      getRowId={(row) => row.content_section_id}
    />
  );
  const tab5 = <Review />;

  const accordionButtons = [
    "Pending",
    "Accepted",
    "Rejected",
    "Completed",
    "Review",
  ];
  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle=" Content Creator Page"
        title="Registered Campaign"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        link={true}
      />


      <div className="tab">
        {
          accordionButtons.map((button, index) => (
            <div className={`named-tab ${activeAccordionIndex === index ? "active-tab" : ""}`} onClick={() => handleAccordionButtonClick(index)}>
              {button}
            </div>
          ))
        }
      </div>
      <div className="card">
        <div className="card-body fx-head thm_table nt-head">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
          {activeAccordionIndex === 2 && tab3}
          {activeAccordionIndex === 3 && tab4}
          {activeAccordionIndex === 4 && tab5}
        </div>
      </div>
      {/* Modal section */}
      {/* Modal-1 accept   */}
      <Modal
        open={open}
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
            Accepted
          </Typography>
          <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Start
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                name="selected"
                value={startData.selected}
                onChange={handleChange}
              >
                <MenuItem value={1}>Immediately</MenuItem>
                <MenuItem value={2}>Choose Date</MenuItem>
              </Select>
            </FormControl>
            {startData.selected == 2 && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker label="Date Time" onChange={handleDateChange} />
              </LocalizationProvider>
            )}
          </div>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            label="Outlined"
            variant="outlined"
            placeholder="Remark here"
            name="remark"
            value={startData.remark}
            onChange={handleChange}
            style={{ width: "100%", marginTop: "10px" }}
          />

          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
            onClick={handleActive}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Modal-1 accept  end  */}

      {/* Modal-2 reject  */}
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
            Reject
          </Typography>

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
            onClick={handleActiveReject}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Modal-2 reject  end  */}

      {/* Modal-3 submission  */}
      <Modal
        open={open3}
        onClose={handleClose3}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6"> Submission </Typography>
          <Paper elevation={3}>
            <Typography variant="h6" sx={{ margin: "10px" }}>
              {" "}
              content Type : {selectedContentType}
            </Typography>
            <Typography variant="h6" sx={{ margin: "10px" }}>
              Date & Time :{submissionData?.creator_dt}
            </Typography>
            <Typography variant="h6" sx={{ margin: "10px" }}>
              {" "}
              time left:
            </Typography>
          </Paper>

          <form onSubmit={handleSubmit}>
            {inputFields.map((inputField, index) => (
              <Box key={index} display="flex" alignItems="center">
                <input
                  type="file"
                  onChange={(e) => handleInputChange(index, e)}
                />
                {inputFields.length > 1 && (
                  <Button
                    variant="outlined"
                    onClick={() => handleRemoveFields(index)}
                    style={{ marginLeft: "5px" }}
                  >
                    X
                  </Button>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddFields}
              style={{ marginTop: "15px" }}
            >
              Add Field
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "15px", marginLeft: "10px" }}
              onClick={() => handleSubmission(inputFields)}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
      {/* Modal-3 submission end  */}

      {/* Modal-4 extend delivery  */}
      <Modal
        open={open4}
        onClose={handleClose4}
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
            Extend Delivery
          </Typography>
          <Typography>Date & time : {extendDeliveryDate}</Typography>
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
            onClick={handleExtend}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Modal-4 extend delivery  end  */}

      {/* Modal-5 terminate request  */}
      <Modal
        open={open5}
        onClose={handleClose5}
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
            Terminate Request
          </Typography>
          {/* <Typography>Date & time : {extendDeliveryDate}</Typography> */}
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            label="Outlined"
            variant="outlined"
            placeholder="Remark here"
            // name="text"
            // value={text}
            // onChange={handleTextChange}
            style={{ width: "100%", marginTop: "10px" }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
            onClick={handleTerminate}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Modal-5 terminate request  end  */}
    </div>
  );
}
