import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegFilePdf } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { Autocomplete, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { baseUrl } from "../../../../utils/config";
import ImageView from "../../ImageView";
import pdf from "../../pdf-file.png";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Tab from "../../../Tab/Tab";
import ApprovedList from "../../ApprovedList";
import EditButtonActionDialog from "../../CommonDialog/EditButtonActionDialog";
import FormatString from "../../FormateString/FormatString";
import BalancePaymentListCardHeader from "../Outstanding/Sales/BalancePaymentListCardHeader";
import UniqueSalesExecutiveDialog from "../Outstanding/Sales/Dialog/UniqueSalesExecutiveDialog";
import UniqueSalesCustomerDialog from "../Outstanding/Sales/Dialog/UniqueSalesCustomerDialog";
import SalesInvoiceEditAction from "../Outstanding/Sales/Dialog/SalesInvoiceEditAction";
import BalancePaymentListFilter from "../Outstanding/Sales/BalancePaymentListFilter";
import TDSDialog from "../Outstanding/Sales/Dialog/TDSDialog";
import DialogforBalancePaymentUpdate from "../Outstanding/Sales/Dialog/DialogforBalancePaymentUpdate";
import { outstandingColumns } from "../../CommonColumn/Columns";
import View from "../../../AdminPanel/Sales/Account/View/View";
import CreditNoteDialog from "./Sales/Dialog/CreditNoteDialog";
import { Diversity1Rounded } from "@mui/icons-material";
import { useGetAllInvoiceRequestQuery } from "../../../Store/API/Finance/InvoiceRequestApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";
import { useGetPaymentDetailListQuery } from "../../../Store/API/Sales/PaymentDetailsApi";
import { useGetAllOutstandingListNewQuery } from "../../../Store/API/Finance/OutstandingNew";
import OutstandingComp from "../../../AdminPanel/Sales/OutstandingComp";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BalancePaymentList = () => {
  const { toastAlert, toastError } = useGlobalContext();

  // const {
  //   refetch: refetchOutstandingList,
  //   data: allOutstandingList,
  //   error: allOutstandingListError,
  //   isLoading: allOutstandingListLoading,
  // } = useGetAllOutstandingListQuery();
  const {
    refetch: refetchOutstandingList,
    data: allOutstandingList,
    isLoading: allOutstandingListLoading,
  } = useGetAllOutstandingListNewQuery();

  const {
    refetch: refetchPaymentMode,
    data: allPaymentMode,
    error: allPayentModeError,
    isLoading: allPaymentModeLoading,
  } = useGetAllPaymentModesQuery();

  const {
    refetch: refetchPaymentDetails,
    data: allPaymentDetails,
    error: allPaymentDetailsError,
    isLoading: allPaymentDetailsLoading,
  } = useGetPaymentDetailListQuery();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentRefImg, setPaymentRefImg] = useState("");
  const [paymentType, setPaymentType] = useState({ label: "", value: "" });
  const [paymentDetails, setPaymentDetails] = useState("");
  const [singleRow, setSingleRow] = useState({});
  const [paidAmount, setPaidAmount] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  // const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [paymentDate, setPaymentDate] = useState(null);


  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [uniqueNonInvoiceCustomerCount, setUniqueNonInvoiceCustomerCount] =
    useState(0);
  const [uniqueNonInvoiceCustomerData, setUniqueNonInvoiceCustomerData] =
    useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveCount,
    setUniqueNonInvoiceSalesExecutiveCount,
  ] = useState(0);
  const [
    uniqueNonInvoiceSalesExecutiveData,
    setUniqueNonInvoiceSalesExecutiveData,
  ] = useState(0);
  const [partyName, setPartyName] = useState("");

  const [dateFilter, setDateFilter] = useState("");
  const [closeDialog, setCloseDialog] = useState(false);
  const [tdsFieldSaleBookingId, setTDSFieldSaleBookingId] = useState("");
  const [discardSaleBookingId, setDiscardSaleBookingId] = useState("");
  const [paidPercentage, setPaidPercentage] = useState("");
  const [tdsPercentage, setTDSPercentage] = useState("");
  const [showField, setShowField] = useState(false);
  const [baseAmount, setBaseAmount] = useState();
  const [campaignAmountData, setCampaignAmountData] = useState();
  const [paidAmountData, setPaidAmountData] = useState();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  const [nonGstStatus, setNonGstStatus] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredPaymentModes, setFilteredPaymentModes] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [editActionDialog, setEditActionDialog] = useState(false);
  const [outstandingRowData, setOutstandingRowData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invcDate, setInvcDate] = useState("");
  const [creditNotesDialog, setCreditNotesDialog] = useState(false);
  const [rowDataForCreditNote, setRowDataForCreditNote] = useState({});

  const accordionButtons = [
    "Oustanding",
    "Non Invoice Created",
    "Approved",
    "All Tax Invoice",
    "Non-Gst Bookings",
    "Credit-Note Invoice",
    "User-Wise Outstanding",
  ];

  const token = sessionStorage.getItem("token");

  // useEffect(() => {
  //   pendingApprovalApi();
  // }, [dateFilter]);

  useEffect(() => {
    if (allOutstandingList && !allOutstandingListLoading) {
      getData();
    }
  }, [allOutstandingList, allOutstandingListLoading]);

  useEffect(() => {
    totalPA();
  }, [paidAmount]);

  useEffect(() => {
    calculatePaidPercentage();
    calculateTDSPercentage();
  }, [balAmount, paidAmount, baseAmount]);

  const calculatePaidPercentage = () => {
    if (paidAmount !== 0) {
      const percentage =
        ((+paidAmount + +paidAmountData) / +campaignAmountData) * 100;
      // const roundedPercentage = percentage * 10;
      setPaidPercentage(percentage.toFixed(1));
    } else {
      setPaidPercentage(0);
    }
  };

  const calculateTDSPercentage = () => {
    const remainingData = balAmount - paidAmount;
    if (remainingData === 0) {
      setTDSPercentage(0);
    } else {
      const percentage = (remainingData / baseAmount) * 100;
      const roundedPercentage = parseFloat(percentage.toFixed(2));
      setTDSPercentage(roundedPercentage);
    }
  };

  const handleDiscardOpenDialog = (e, rowData) => {
    e.preventDefault();
    setDiscardSaleBookingId(rowData.sale_booking_id);
    setDiscardDialog(true);
  };

  const getData = () => {
    if (!allOutstandingList) return;
    const transformedData = allOutstandingList?.reduce((acc, object) => {
      if (object?.salesInvoiceRequestData?.length > 0) {
        const invoices = object?.salesInvoiceRequestData?.map((invoice) => ({
          ...invoice,
          account_id: object.account_id,
          sale_booking_date: object.sale_booking_date,
          campaign_amount: object.campaign_amount,
          base_amount: object.base_amount,
          balance_payment_ondate: object.balance_payment_ondate,
          gst_status: object.gst_status,
          created_by: object.created_by,
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
          sale_booking_id: object.sale_booking_id,
          url: object.url,
          account_name: object.account_name,
          created_by_name: object.created_by_name,
          paid_amount: object.paid_amount,
          invoice_id: object._id,
        }));
        acc?.push(...invoices);
      } else {
        const tempObject = {
          ...object,
        };
        acc?.push(tempObject);
      }
      return acc;
    }, []);
    const reversedData = transformedData?.reverse();
    setData(reversedData);
    setFilterData(reversedData);
    setUniqueCustomerCount(111);
    setUniqueCustomerData(transformedData);
    setUniqueSalesExecutiveCount(111);
    setUniqueSalesExecutiveData(111);
    setUniqueNonInvoiceCustomerCount(111);
    setUniqueNonInvoiceCustomerData(111);
    setUniqueNonInvoiceSalesExecutiveCount(111);
    setUniqueNonInvoiceSalesExecutiveData(111);
  };
  // const pendingApprovalApi = () => {
  //   axios
  //     .get(
  //       baseUrl + `sales/payment_update_status_list_data/?status=${"pending"}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       const pedingAppData = res?.data?.data;
  //       setTotalCount(pedingAppData?.length);
  //     });
  // };

  const handleImageClick = (e, row) => {
    console.log(e, row, "row")
    e.preventDefault();
    setBalAmount(row?.campaign_amount - row?.paid_amount);
    setBaseAmount(row?.base_amount);
    setPaidAmountData(row?.paid_amount);
    setCampaignAmountData(row.campaign_amount);
    setTDSFieldSaleBookingId(row.sale_booking_id);
    setNonGstStatus(row.gst_status);
    setSingleRow(row);
    refetchOutstandingList();
    setImageModalOpen(true);
    // return;
  };

  function calculateAging(date1, date2) {
    const oneHour = 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffHours = Math.round(Math.abs((firstDate - secondDate) / oneHour));

    return diffHours;
  }

  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };
  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const calculateRequestedAmountTotal = () => {
    const invc = filterData?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file !== "" &&
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id === "tax-invoice"
    );
    let totalAmount = 0;
    invc?.forEach((customer) => {
      totalAmount += parseFloat(
        customer?.campaign_amount - customer?.paid_amount
      );
    });

    return totalAmount;
  };

  const calculateNonRequestedAmountTotal = () => {
    const nonInvc = filterData?.filter(
      (invc) =>
        invc?.salesInvoiceRequestData?.[0]?.invoice_file === "" ||
        invc?.salesInvoiceRequestData?.[0]?.invoice_type_id !== "tax-invoice"
    );
    let totalAmount = 0;
    nonInvc?.forEach((customer) => {
      totalAmount += parseFloat(
        customer.campaign_amount - customer.paid_amount
      );
    });

    return totalAmount;
  };

  // Call the function to get the total sum of requested amount
  const balanceAmountTotal = calculateRequestedAmountTotal();
  const nonInvcbalanceAmountTotal = calculateNonRequestedAmountTotal();
  // All counts :-
  const approvedCount = datas?.filter(
    (item) => item.finance_refund_status === 1
  )?.length;
  const rejectedCount = datas?.filter(
    (item) => item.finance_refund_status === 2
  )?.length;

  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const totalPA = () => {
    return +campaignAmountData - (+paidAmountData + paidAmount);
  };

  const handleOpenEditAction = (rowData) => {
    setOutstandingRowData(rowData);
    setEditActionDialog(true);
  };

  useEffect(() => {
    if (paymentDetails) {
      const filteredModes = allPaymentMode?.filter(
        (mode) => mode?._id === paymentDetails?.payment_mode_id
      );
      setFilteredPaymentModes(filteredModes);
    } else {
      setFilteredPaymentModes(allPaymentMode);
    }
  }, [paymentDetails, allPaymentMode]);

  const handleOpenCreditNote = (e, row) => {
    setCreditNotesDialog(true);
    setRowDataForCreditNote(row);
  };

  // Helper function for filtering
  const getFilteredData = (index, data) => {
    if (!data) return [];

    const conditions = {
      0: (invc) =>
        invc.invoice_type_id === "tax-invoice" &&
        invc.invoice_creation_status !== "pending" &&
        invc.gst_status === true &&
        invc.paid_amount <= invc.campaign_amount * 0.9,
      1: (invc) =>
        invc.invoice_type_id !== "tax-invoice" ||
        invc.invoice_creation_status === "pending",
      3: (invc) => invc.invoice_type_id !== "proforma",
      4: (invc) =>
        invc.gst_status === false &&
        invc.invoice_creation_status !== "pending" &&
        invc.paid_amount <= invc.campaign_amount * 0.9,
      5: (invc) => invc.invoice_type_id === "credit_note",
    };

    const filterCondition = conditions[index];
    return filterCondition ? data.filter(filterCondition) : [];
  };

  const filteredData = getFilteredData(activeAccordionIndex, filterData);
  // console.log(filteredData, "hghjdghjg")
  return (
    <div>
      {activeAccordionIndex === 2 ? (
        ""
      ) : (
        <>
          {/* <FormContainer
            mainTitle="Sale Booking - Outstanding Payment"
            link="/admin/balance-payment-list"
            buttonAccess={
              contextData &&
              contextData[2] &&
              contextData[2].insert_value === 1 &&
              false
            }
            uniqueCustomerCount={uniqueCustomerCount}
            uniqueNonInvoiceCustomerCount={uniqueNonInvoiceCustomerCount}
            uniqueNonInvoiceSalesExecutiveCount={
              uniqueNonInvoiceSalesExecutiveCount
            }
            accIndex={activeAccordionIndex}
            balanceAmountTotal={balanceAmountTotal}
            nonInvcbalanceAmountTotal={nonInvcbalanceAmountTotal}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
            handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
            uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
            handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
            balancePaymentAdditionalTitles={true}
          /> */}

          {/* <Button variant="contained" className="mb-4">
            <Link to="/admin/finance-pendingapproveupdate/">
              Pending Approval ({totalCount})
            </Link>
          </Button> */}
          {/* Add Icon TDS */}
          {closeDialog && (
            <TDSDialog
              closeDialog={closeDialog}
              setCloseDialog={setCloseDialog}
              singleRow={singleRow}
              balAmount={balAmount}
              setBalAmount={setBalAmount}
              paidAmount={paidAmount}
              tdsPercentage={tdsPercentage}
              paymentRefNo={paymentRefNo}
              paymentDetails={paymentDetails}
              paymentRefImg={paymentRefImg}
              setPaymentRefImg={setPaymentRefImg}
              paymentDate={paymentDate}
              tdsFieldSaleBookingId={tdsFieldSaleBookingId}
              getData={refetchOutstandingList}
            />
          )}

          {/* Edit action Dialog */}
          {editActionDialog && (
            <SalesInvoiceEditAction
              editActionDialog={editActionDialog}
              setEditActionDialog={setEditActionDialog}
              outstandingRowData={outstandingRowData}
              getData={refetchOutstandingList}
              setViewImgDialog={setViewImgDialog}
              viewImgSrc={viewImgSrc}
              setViewImgSrc={setViewImgSrc}
              viewImgDialog={viewImgDialog}
            />
          )}

          {/* Unique Sales Executive Dialog Box */}
          {uniqueSalesExecutiveDialog && (
            <UniqueSalesExecutiveDialog
              columns={columns}
              filterData={filterData}
              uniqueSalesExecutiveDialog={uniqueSalesExecutiveDialog}
              activeAccordionIndex={activeAccordionIndex}
              uniqueSalesExecutiveData={uniqueSalesExecutiveData}
              uniqueNonInvoiceSalesExecutiveData={
                uniqueNonInvoiceSalesExecutiveData
              }
              setUniqueSalesExecutiveDialog={setUniqueSalesExecutiveDialog}
            />
          )}

          {/* Unique Customer Dialog Box */}
          {uniqueCustomerDialog && (
            <UniqueSalesCustomerDialog
              columns={columns}
              filterData={filterData}
              uniqueCustomerDialog={uniqueCustomerDialog}
              setUniqueCustomerDialog={setUniqueCustomerDialog}
              activeAccordionIndex={activeAccordionIndex}
            />
          )}

          {/* <BalancePaymentListCardHeader filterData={filterData} /> */}

          <CreditNoteDialog
            setCreditNotesDialog={setCreditNotesDialog}
            creditNotesDialog={creditNotesDialog}
            rowDataForCreditNote={rowDataForCreditNote}
            setViewImgDialog={setViewImgDialog}
            setViewImgSrc={setViewImgSrc}
            getData={refetchOutstandingList}
          />
        </>
      )}

      <Tab
        tabName={accordionButtons}
        activeTabindex={activeAccordionIndex}
        onTabClick={handleAccordionButtonClick}
      />
      <div>
        {(activeAccordionIndex === 3 ||
          activeAccordionIndex === 4 ||
          activeAccordionIndex === 5 ||
          activeAccordionIndex === 0 ||
          activeAccordionIndex === 1) &&
          filteredData.length > 0 && (
            <View
              columns={outstandingColumns({
                filterData,
                calculateAging,
                setViewImgSrc,
                setViewImgDialog,
                handleImageClick,
                handleDiscardOpenDialog,
                handleOpenEditAction,
                activeAccordionIndex,
                handleOpenCreditNote,
              })}
              data={filteredData}
              isLoading={isLoading}
              title={"Outstanding"}
              rowSelectable={true}
              showTotal={true}
              pagination={[100, 200]}
              tableName={"sales_booking_outstanding_for_finanace"}
              selectedData={setSelectedData}
              addHtml={
                <>
                  <button
                    className="btn cmnbtn btn_sm btn-secondary"
                    onClick={(e) => handleClearSameRecordFilter(e)}
                  >
                    Clear
                  </button>
                </>
              }
            />
          )}

        {activeAccordionIndex === 2 && <ApprovedList />}
        {activeAccordionIndex === 6 && <OutstandingComp />}
      </div>

      {/* Dialog box for balance payment update*/}
      {ImageModalOpen && (
        <DialogforBalancePaymentUpdate
          setPaymentDetails={setPaymentDetails}
          paidPercentage={paidPercentage}
          paymentDetails={paymentDetails}
          dropdownData={allPaymentDetails}
          paymentDate={paymentDate}
          setPaymentDate={setPaymentDate}
          balAmount={balAmount}
          setBalAmount={setBalAmount}
          paidAmountData={paidAmountData}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          paymentRefNo={paymentRefNo}
          setPaymentRefNo={setPaymentRefNo}
          ImageModalOpen={ImageModalOpen}
          setImageModalOpen={setImageModalOpen}
          setPaidPercentage={setPaidPercentage}
          singleRow={singleRow}
          getData={refetchOutstandingList}
          setCloseDialog={setCloseDialog}
          paymentRefImg={paymentRefImg}
          setPaymentRefImg={setPaymentRefImg}
        />
      )}

      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
    </div>
  );
};

export default BalancePaymentList;
