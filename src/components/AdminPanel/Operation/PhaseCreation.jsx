import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import CampaignDetails from "./CampaignDetails";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import formatString from "./CampaignMaster/WordCapital";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PhaseCreation = () => {
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();

  const param = useParams();
  const id = param.id;
  const [phaseDiscription, setPhaseDiscription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [phaseName, setPhaseName] = useState("");
  const [campaignDetails, setCampaignDetails] = useState({});
  const [planData, setPlanData] = useState([]);
  const [payloadData, setPayloadData] = useState({});
  const [phaseData, setPhaseData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [newPids, setNewPids] = useState([]);
  const [replacePages, setReplacePages] = useState([]);
  const [replaceId, setReplaceId] = useState("");
  const handleOpen = (page, phaseName) => {
    setOpen(true);
    setReplaceId(page);
    setPhaseName(phaseName);
  };
  const handleClose = () => setOpen(false);

  const getCampaignDetails = async () => {
    try {
      const forPayload = await axios.get(baseUrl + `opcampaign/${id}`);
      setPayloadData(forPayload.data[0]);

      const Fdata = await axios.get(baseUrl + `opcampaignplan/${id}`);
      setCampaignDetails(Fdata.data.data);

      const campaignPIds = Fdata.data.data.map((campaign) => campaign.p_id);

      const inventoryDataResponse = await axios.get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
      );

      const filteredInventoryData = inventoryDataResponse.data.body.filter(
        (item) => campaignPIds.includes(item.p_id)
      );

      const newData = filteredInventoryData.map((item) => ({
        p_id: item.p_id,
        page_name: item.page_name,
        cat_name: item.cat_name,
        follower_count: item.follower_count,
        page_link: item.page_link,
      }));

      setPlanData(newData);
      const filteredInventoryDataN = inventoryDataResponse.data.body.filter(
        (item) => !campaignPIds.includes(item.p_id)
      );

      const newDataN = filteredInventoryDataN.map((item) => ({
        p_id: item.p_id,
        page_name: item.page_name,
        cat_name: item.cat_name,
        follower_count: item.follower_count,
        page_link: item.page_link,
      }));

      setReplacePages(newDataN);
    } catch (error) {
      console.log(error);
    }
  };

  const getPhaseDetails = async () => {
    try {
      const phaseDataVar = await axios.get(baseUrl + `opcampaignphase/${id}`);
      const groupedPhaseData = phaseDataVar.data.reduce((acc, item) => {
        const { phaseName, ...rest } = item;
        if (!acc[phaseName]) {
          acc[phaseName] = {
            phaseName,
            pages: [],
          };
        }
        acc[phaseName].pages.push(rest);
        return acc;
      }, {});
      setPhaseData(Object.values(groupedPhaseData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPhaseDetails();
    getCampaignDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedPages = planData.filter((row) =>
        selectedRows.includes(row.p_id)
      );
      const pages = selectedPages.map((page) => ({
        p_id: page.p_id,
        postPerPage: page.posts_per_page || 1,
        storyPerPage: page.story_per_page || 1,
      }));

      const postResult = await axios.post(`${baseUrl}opcampaignphase`, {
        campaignId: payloadData._id,
        planId: 1,
        phaseName: phaseName,
        start_date: startDate,
        end_date: endDate,
        pages: pages,
      });

      toastAlert(" Phase Created Successfully");
      navigate("/admin/op-campaign-executions", {
        state: { campaignId: payloadData._id }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 10,
    },
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = planData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        const formattedPageName = formatString(params.row.page_name);
        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {formattedPageName}
              </a>
            )}
          </div>
        );
      },
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 250,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
    },
    {
      field: "posts_per_page",
      headerName: "Posts",
      width: 140,
      renderCell: (params) => <input type="number" style={{ width: "80px" }} />,
    },
    {
      field: "story_per_page",
      headerName: "Story ",
      width: 140,
      renderCell: (params) => <input type="number" style={{ width: "80px" }} />,
    },
  ];

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
    const selectedData = planData.filter((row) =>
      selectedIds.includes(row.p_id)
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const deletePage = async (page) => {
    try {
      const response = await axios.delete(baseUrl + `opcampaignphase`, {
        data: {
          campaignId: id,
          p_id: page.p_id,
        },
      });
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const replacePage = async (page) => {
    try {
      const filteredPids = newPids.map((item) => item.value);
      const response = await axios.post(baseUrl + `replace_phase_pages`, {
        campaignId: id,
        old_pid: replaceId.p_id,
        new_pid: filteredPids,
        phaseName: phaseName,
      });
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const renderPhaseTable = (phase) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Page Name</TableCell>
            <TableCell>Follower Count</TableCell>
            <TableCell>Page Link</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Replace</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {phase.pages.map((page, index) => (
            <TableRow key={index}>
              <TableCell>{formatString(page.page_name)}</TableCell>
              <TableCell>{page.follower_count}</TableCell>
              <TableCell>
                <a
                  href={page.page_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {page.page_link}
                </a>
              </TableCell>
              <TableCell>{page.cat_name}</TableCell>
              <TableCell>
                <button onClick={() => handleOpen(page, phase.phaseName)}>
                  Replace
                </button>
              </TableCell>
              <TableCell>
                <button onClick={() => deletePage(page)}>Delete</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const phasePIds = phaseData.flatMap((phase) =>
    phase.pages.map((page) => page.p_id)
  );
  const filteredPlanData = planData.filter(
    (row) => !phasePIds.includes(row.p_id)
  );

  return (
    <>
      <FormContainer mainTitle="Phase Creation" link="true" />

      <CampaignDetails cid={id} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="form-group col-12">
            <p>
              {" "}
              You Are replacing {replaceId.page_name} {replaceId.p_id}{" "}
            </p>
            <label className="form-label">
              With <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              isMulti
              options={replacePages.map((option) => ({
                value: `${option.p_id}`,
                label: `${option.page_name}`,
              }))}
              onChange={(e) => {
                setNewPids(e);
              }}
            />
          </div>
          <button
            className="btn btn-outline-success rounded-pill"
            onClick={() => replacePage()}
            style={{ width: "30%" }}
          >
            Replace
          </button>
        </Box>
      </Modal>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <TextField
            type="text"
            label="Phase name"
            className="form-control"
            style={{ width: "300px" }}
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
          />
        </div>
        <div>
          <TextField
            type="text"
            label="Description"
            className="form-control"
            style={{ width: "300px" }}
            value={phaseDiscription}
            onChange={(e) => setPhaseDiscription(e.target.value)}
          />
        </div>
        <div>
          <label> Start date</label>
          <input
            type="date"
            className="form-control"
            style={{ width: "100%" }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label> End date</label>
          <input
            type="date"
            className="form-control"
            style={{ width: "100%" }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div style={{}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 0.5,
            height: "700px",
            width: `${selectedRows.length > 0 && "100%"}`,
          }}
        >
          <DataGrid
            rows={filteredPlanData}
            columns={columns}
            getRowId={(row) => row.p_id}
            checkboxSelection
            pagination
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows?.map((row) => row)}
          />
        </div>
        <br />
        <button
          className="btn btn-outline-danger rounded-pill"
          onClick={handleSubmit}
          style={{ width: "10%" }}
          disabled={!phaseName}
        >
          Submit
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="phase tabs"
        >
          {phaseData.map((phase, index) => (
            <Tab key={index} label={phase.phaseName} />
          ))}
        </Tabs>
        {phaseData.map((phase, index) => (
          <TabPanel key={index} value={tabIndex} index={index}>
            {renderPhaseTable(phase)}
          </TabPanel>
        ))}
      </div>
    </>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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

export default PhaseCreation;
