import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../AdminPanel/FormContainer";
import FieldContainer from "../../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DataTable from "react-data-table-component";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import View from "../../../AdminPanel/Sales/Account/View/View";

const PaymentMode = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [heading, setHeading] = useState("");
  const [headingDesc, setHeadingDesc] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [title, setTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [gst, setGST] = useState("");
  const [hideRowDialog, setHideRowDialog] = useState(false);
  const [hiddenDataArray, setHiddenData] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl + "", {
      display_sequence: displaySeq,
    });

    toastAlert("Coc created");
    setIsFormSubmitted(true);
  };
  const getData = () => {
    setIsLoading(true);

    axios
      .get(baseUrl + "sales/payment_details", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setIsLoading(false);
        setData(res?.data?.data);
        setFilterData(res?.data?.data);
      })
      .catch((error) =>
        console.log(error, "Error While getting payment mode data")
      );
  };
  const handleHiddenGetData = () => {
    axios
      .get(baseUrl + "sales/payment_details?is_hide=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setHiddenData(res?.data?.data);
      })
      .catch((error) =>
        console.log(error, "Error While getting payment mode data")
      );
  };

  const handleCopyDetail = (detail) => {
    navigator.clipboard.writeText(detail);
    toastAlert("Detail copied");
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas?.filter((d) => {
      return d.title?.toLowerCase()?.match(search?.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas?.filter((item) => {
      // Title Filter:-
      const titleFilterPassed =
        !title || item.title?.toLowerCase()?.includes(title?.toLowerCase());

      // Bank Name By Filter
      const bankNameFilterPassed =
        !bankName ||
        item.details?.toLowerCase()?.includes(bankName?.toLowerCase());
      // Payment Type Filter
      const paymentTypeFilterPassed =
        !paymentType ||
        item.payment_mode_name
          ?.toLowerCase()
          ?.includes(paymentType?.toLowerCase());
      // row.gst_bank === 1 ? "GST" : "Non GST";
      // GST Bank Filter
      const gstFilterPassed =
        !gst ||
        (item.gst_bank === true && gst?.toLowerCase() === "gst") ||
        (item.gst_bank === false && gst?.toLowerCase() === "non gst");

      // combining all logic
      const allFiltersPassed =
        titleFilterPassed &&
        bankNameFilterPassed &&
        paymentTypeFilterPassed &&
        gstFilterPassed;

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setBankName("");
    setPaymentType("");
    setGST("");
    setTitle("");
  };
  // HIDE/SHOW ROW
  const handleOpenHideRowData = () => {
    setHideRowDialog(true);
    handleHiddenGetData();
  };
  const handleCloseHideRowData = () => {
    setHideRowDialog(false);
  };
  // =================================
  const handleHideRowData = async (data) => {
    const formData = {
      is_hide: true,
    };

    await axios
      .put(baseUrl + `sales/payment_details/${data._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        getData();
        // setHiddenRows((prevHiddenRows) => [...prevHiddenRows, data.id]);
        toastAlert("Row Hidden Successfully");
      });
  };
  const handleUnHideRowData = async (data) => {
    const formData = {
      is_hide: false,
    };
    await axios
      .put(baseUrl + `sales/payment_details/${data._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        getData();
        handleCloseHideRowData();
        // setHiddenRows((prevHiddenRows) => [...prevHiddenRows, data.id]);
        toastAlert("Row UnHide Successfully");
      });
  };

  const columns = [
    {
      name: "S.No",
      key: "s_no",
      renderRowCell: (row, index) => {
        index + 1;
      },
    },
    {
      key: "title",
      name: "Title",
      width: 200,
      // renderCell: (params) => <div>{params.row.title}</div>,
      // sortable: false,
    },
    {
      name: "Details",
      key: "details",
      width: 700,
      // selector: (row) =>  <div style={{ whiteSpace: 'normal' }}>{row.detail}
      //   <Button key={row.detail} variant="contained" color="primary" onClick={console.log('clicked')} style={{marginLeft: "10px"}}>Copy</Button>
      // </div>,
      renderRowCell: (row) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            key={row?.details}
            onClick={() => handleCopyDetail(row?.details)}
          >
            <ContentCopyIcon />
          </button>
          {row?.details}
        </div>
      ),
    },
    {
      key: "payment_type",
      name: "Payment Type",
      width: 200,
      renderRowCell: (row) => row?.payment_mode_name,
    },
    {
      name: "GST Bank",
      key: "gst_bank",
      width: 200,
      renderRowCell: (row) => {
        return <div>{row?.gst_bank === true ? "GST" : "Non GST"}</div>;
      },
    },
    {
      key: "Action",
      name: "Action",
      renderRowCell: (row) => {
        return (
          <div className="d-flex gap-10">
            <button
              onClick={() => handleHideRowData(row)}
              className="btn cmnbtn btn_sm btn-outline-primary"
            >
              Hide
            </button>
          </div>
        );
      },
    },
    {
      // headerName: "",
      // field: "Action",
      renderRowCell: (row) => {
        return (
          <div className="d-flex gap-10">
            <Link
              to={`/admin/finance-payment-mode-transactionlist/${row?._id}`}
              className="link-primary"
            >
              <button className="icon-1" title="Transaction History">
                <i className="bi bi-file-earmark-text-fill p-5"></i>
              </button>
            </Link>
          </div>
        );
      },
    },
  ];
  const HiddenRowColumns = [
    {
      headerName: "S.No",
      field: "s_no",
      renderCell: (params, index) => (
        <div>{[...hiddenDataArray]?.indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 200,
      // renderCell: (params) => <div>{params.row.title}</div>,
      // sortable: false,
    },
    {
      headerName: "Detail",
      field: "details",
      width: 700,
      // selector: (row) =>  <div style={{ whiteSpace: 'normal' }}>{row.detail}
      //   <Button key={row.detail} variant="contained" color="primary" onClick={console.log('clicked')} style={{marginLeft: "10px"}}>Copy</Button>
      // </div>,
      renderCell: (params) => (
        <div className="flexCenter colGap8">
          <button
            className="btn tableIconBtn btn_sm "
            key={params.row.details}
            onClick={() => handleCopyDetail(params.row.details)}
          >
            <ContentCopyIcon />
          </button>
          {params.row.details}
        </div>
      ),
    },
    {
      field: "payment_type",
      headerName: "Payment Type",
      width: 200,
      renderCell: (params) => params.row.payment_mode_name,
    },
    {
      headerName: "GST Bank",
      field: "gst_bank",
      width: 200,
      renderCell: (params) => {
        return <div>{params.row.gst_bank === true ? "GST" : "Non GST"}</div>;
      },
    },
    {
      headerName: "Action",
      field: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              onClick={() => handleUnHideRowData(params.row)}
            >
              UnHide
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Payment Mode"
        link="/admin/finance-paymentmode"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
      {/* Show Hide Dialog */}
      <Dialog
        open={hideRowDialog}
        onClose={handleCloseHideRowData}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Hidden Data</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseHideRowData}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table">
            <DataGrid
              rows={hiddenDataArray}
              columns={HiddenRowColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => filterData?.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* ============================= */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-3 col-sm-12">
                  <div className="form-group">
                    <label> Title</label>
                    <Autocomplete
                      value={title}
                      onChange={(event, newValue) => setTitle(newValue)}
                      options={Array?.from(
                        new Set(datas?.map((option) => option.title || ""))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Title"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="form-group">
                    <label> Bank Name</label>
                    <Autocomplete
                      value={bankName}
                      onChange={(event, newValue) => setBankName(newValue)}
                      options={Array?.from(
                        new Set(datas?.map((option) => option.details || ""))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bank Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="form-group">
                    <label> Payment Type</label>
                    <Autocomplete
                      value={paymentType}
                      onChange={(event, newValue) => setPaymentType(newValue)}
                      options={Array?.from(
                        new Set(
                          datas?.map(
                            (option) => option?.payment_mode_name || ""
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Payment Type"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="form-group">
                    <label> GST</label>
                    <Autocomplete
                      value={gst}
                      onChange={(event, newValue) => setGST(newValue)}
                      options={Array?.from(
                        new Set(
                          datas?.map((option) =>
                            option.gst_bank === true ? "GST" : "Non GST" || ""
                          )
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="GST"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                          style={{
                            borderRadius: "0.25rem",
                            transition:
                              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                            "&:focus": {
                              borderColor: "#80bdff",
                              boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  onClick={handleAllFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOpenHideRowData}
                  className="btn cmnbtn btn-tertiary"
                >
                  Hidden Data
                </Button>
                <Link to="/admin/Incentive-Payment-Mode-Payment-Details">
                  <Button
                    variant="contained"
                    className="btn cmnbtn btn-primary"
                  >
                    Add Payment Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <View
          columns={columns}
          data={filterData?.filter((data) => data?.is_hide === false)}
          isLoading={isLoading}
          title={"Payment Mode"}
          rowSelectable={true}
          pagination={[100, 200]}
          tableName={"payment_details"}
          selectedData={setSelectedData}
        />
      </div>
    </div>
  );
};

export default PaymentMode;
