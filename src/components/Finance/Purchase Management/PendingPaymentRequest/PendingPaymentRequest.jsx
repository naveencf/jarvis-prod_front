import { useCallback, useEffect, useState } from 'react';
import FormContainer from '../../../AdminPanel/FormContainer';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import logo from '../../../../../public/logo.png';
import { Button } from '@mui/material';
import DiscardConfirmation from './Components/DiscardConfirmation';
import jwtDecode from 'jwt-decode';
import ImageView from '../../ImageView';
import { useGlobalContext } from '../../../../Context/Context';
import { baseUrl, insightsBaseUrl, phpBaseUrl } from '../../../../utils/config';
import ShowDataModal from './Components/ShowDataModal';
import WhatsappAPI from '../../../WhatsappAPI/WhatsappAPI';
import moment from 'moment';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import PayVendorDialog from '././Components/PayVendorDialog';
import CommonDialogBox from './Components/CommonDialogBox';
import BankDetailPendingPaymentDialog from './Components/BankDetailPendingPaymentDialog';
import PayThroughVendorDialog from './Components/PayThroughVendorDialog';
import BulkPayThroughVendorDialog from './Components/BulkPayThroughVendorDialog';
import OverviewContainedDialog from './Components/OverviewContainedDialog';
import PendingPaymentReqFilters from './Components/PendingPaymentReqFilters';
import { pendingPaymentDetailColumns, pendingPaymentReqRemainderDialogColumns, pendingPaymentRequestColumns, pendingPaymentUniqueVendorColumns } from '../../CommonColumn/Columns';
import View from '../../../AdminPanel/Sales/Account/View/View';
import ZohoBillCreation from './Components/ZohoBillCreation';
import { Balance } from '@mui/icons-material';
import { formatNumber } from '../../../../utils/formatNumber';
import { useGetVendorPaymentRequestsQuery } from '../../../Store/API/Purchase/PurchaseRequestPaymentApi';

export default function PendingPaymentRequest() {
  const whatsappApi = WhatsappAPI();
  const { toastAlert, toastError } = useGlobalContext();
  const { data, isLoading: requestLoading, error, refetch: refetchPaymentRequerst } = useGetVendorPaymentRequestsQuery();
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const userName = decodedToken.name;
  // const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [payDialog, setPayDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showDisCardModal, setShowDiscardModal] = useState(false);
  const [paymentAmout, setPaymentAmount] = useState(0);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState('');
  // const [userName, setUserName] = useState("");
  const [uniqueVendorCount, setUniqueVendorCount] = useState(0);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [uniqueVenderDialog, setUniqueVenderDialog] = useState(false);
  const [uniqueVendorData, setUniqueVendorData] = useState([]);
  const [sameVendorDialog, setSameVendorDialog] = useState(false);
  const [bankDetail, setBankDetail] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [reminderData, setReminderData] = useState([]);
  const [remainderDialog, setRemainderDialog] = useState(false);
  const [aknowledgementDialog, setAknowledgementDialog] = useState(false);
  const [nodeData, setNodeData] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [historyType, setHistoryType] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [baseAmount, setBaseAmount] = useState(0);
  const [bankDetailRowData, setBankDetailRowData] = useState([]);

  const [dateFilter, setDateFilter] = useState('');
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [nonInvoiceCount, setNonInvoiceCount] = useState(0);
  const [nonGstCount, setNonGstCount] = useState(0);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [vendorNameList, setVendorNameList] = useState([]);
  // const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const [overviewDialog, setOverviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [netAmount, setNetAmount] = useState('');
  const [tdsDeductedCount, setTdsDeductedCount] = useState(0);
  const accordionButtons = ['All', 'Partial', 'Instant'];
  const [payThroughVendor, setPayThroughVendor] = useState(false);
  const [bulkPayThroughVendor, setBulkPayThroughVendor] = useState('');
  const [isZohoStatusFileUploaded, setIsZohoStatusFileUploaded] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [GSTHoldAmount, setGSTHoldAmount] = useState(0);
  const [TDSValue, setTDSValue] = useState(0);
  const [refetch, setRefetch] = useState(false);
  const [yesBankBalance, setYesBankBalance] = useState(0);
  const [yesBankBalanceProcessing, setYesBankBalanceProcessing] = useState(false);
  var handleAcknowledgeClick = () => {
    setAknowledgementDialog(true);
  };

  const getValidationCSSForRemainder = (params) => {
    const reminder = phpRemainderData?.filter((item) => item.request_id == params.row.request_id);
    return reminder?.length > 2 ? 'bg-danger' : '';
  };

  const callApi = async () => {
    //Reminder API
    // setIsLoading(true);

    // await axios
    //   .get(
    //     phpBaseUrl + `?view=getpaymentrequest`
    //   )
    //   .then((res) => {
    //     let y = res?.data?.body;
    //     const requestPayments = y.filter((res) => (res.proccessingAmount == 0 || res.proccessingAmount == null) && (res.status == 0 || res.status == 3));
    //     console.log(requestPayments, "resf")
    //     setPhpData(requestPayments);
    //     setIsLoading(false);
    //     // setData(requestPayments);
    //     setFilterData(requestPayments);
    //     setPendingRequestCount(requestPayments.length);
    //     // // console.log(y, "y", remindData)

    //   })
    //   .catch((error) => {
    //     console.log("Error while getting Node Data");
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error while getting php pending payment request data");
    // });

    // axios
    //   .get(`${baseUrl}` + `get_single_user/${userID}`)
    //   .then((res) => {
    //     setUserName(res.data.user_name);
    //   })
    //   .catch((error) => {
    //     console.log("Error while getting single user data");
    //   });
    refetchPaymentRequerst();
  };

  useEffect(() => {
    // callApi();
    if (data?.length > 0) {
      console.log(data, "filterdata")
      // const requestPayments = data.filter((res) => (res.proccessingAmount == 0 || res.proccessingAmount == null) && (res.status == 0 || res.status == 3));
      const requestPayments = data
      setPhpData(requestPayments);
      setIsLoading(false);
      // setData(requestPayments);
      setFilterData(requestPayments);
      setPendingRequestCount(requestPayments.length);
    }
    console.log("dataFilter", dateFilter);
  }, [dateFilter, refetch, data]);

  const handleRemainderModal = (reaminderData) => {
    setReminderData(reaminderData);
    setRemainderDialog(true);
  };

  GridToolbar.defaultProps = {
    filterRowsButtonText: 'Filter',
    filterGridToolbarButton: 'Filter',
  };

  const calculateTotals = (data) => {
    return (
      data?.reduce(
        (totals, item) => {
          const requestAmount = parseFloat(item?.request_amount) || 0;
          const balanceAmount = parseFloat(item?.outstandings) || 0;
          return {
            totalPendingAmount: totals.totalPendingAmount + requestAmount,
            totalBalanceAmount: totals.totalBalanceAmount + balanceAmount,
          };
        },
        { totalPendingAmount: 0, totalBalanceAmount: 0 }
      ) || { totalPendingAmount: 0, totalBalanceAmount: 0 }
    );
  };
  const { totalPendingAmount, totalBalanceAmount } = calculateTotals(filterData);

  const handleDiscardClick = (e, row) => {
    e.preventDefault();
    setRowData(row);
    setShowDiscardModal(true);
  };

  const handlePayClick = (e, row) => {
    // if (!row || row?.mob1.length != 10) {
    //   toastError("Mobile number is not correct for this vendor")
    //   // return;
    // } else if (row?.vendor_name.length == 0 || row?.vendor_name == "") {
    //   toastError("Vendor Name is not available for this transaction")
    //   return;
    // }
    e?.preventDefault();
    setSelectedRows([row]);
    let x = phpRemainderData.filter((item) => item?.request_id == row?.request_id);
    if (x.length > 0) {
      toastError(`You can't pay this request as it has been reminded ${x?.length} times`);
      return;
    }
    const enrichedRow = {
      ...row,
      totalFY: calculateTotalFY(row),
    };
    setLoading(true);
    setRowData(enrichedRow);
    console.log(Number(row.outstandings) - Number(row?.getway_process_amt), 'bal-proc');
    setPaymentAmount(Number(row.outstandings) - Number(row?.proccessingAmount));
    setNetAmount(row.outstandings);
    setBaseAmount(row.base_amount != 0 ? row.base_amount : row.request_amount);
    console.log(row, row?.proccessingAmount, "row");
    setPayDialog(true);
  };

  useEffect(() => {
    if (loading == false) return;
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  const handleOpenUniqueVendorClick = () => {
    setUniqueVenderDialog(true);
  };

  const handleCloseUniqueVendor = () => {
    setUniqueVenderDialog(false);
  };
  // overview functions :----
  const handleOpenOverview = () => {
    setOverviewDialog(true);
  };
  // --------------------------------------------
  const handleOpenSameVender = (vendorName) => {
    setSameVendorDialog(true);

    const sameNameVendors = data.filter((item) => item.vendor_name === vendorName);
    setFilterData(sameNameVendors);
    handleCloseUniqueVendor();
  };

  // Bank Details:-
  const handleOpenBankDetail = (row) => {
    let x = [];
    x.push(row);
    setBankDetailRowData(x);
    setBankDetail(true);
  };
  const handleCloseBankDetail = () => {
    setBankDetail(false);
  };

  // Payment history detail:-
  const handleOpenPaymentHistory = (row, type) => {
    setHistoryType(type);
    setRowData(row);
    setPaymentHistory(true);
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();

    const startDate = new Date(`04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`);
    const endDate = new Date(`03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`);

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e.request_date);
      return paymentDate >= startDate && paymentDate <= endDate && e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2;
    });

    const dataTP = nodeData.filter((e) => {
      return e.vendor_name === row.vendor_name && e.status != 0 && e.status != 2;
    });
    setHistoryData(type == 'FY' ? dataFY : dataTP);
  };
  const handleClosePaymentHistory = () => {
    setPaymentHistory(false);
  };
  // ==============================================================
  // accordian function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const getStatusText = (status) => {
    switch (status) {
      case '0':
        return 'Pending';
      case '1':
        return 'Paid';
      case '2':
        return 'Discard';
      case '3':
        return 'Partial';
      default:
        return '';
    }
  };

  const calculateTotalFY = (data) => {
    const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
    const currentYear = new Date().getFullYear();
    const startDate = new Date(`04/01/${isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1}`);
    const endDate = new Date(`03/31/${isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear}`);

    const dataFY = nodeData.filter((e) => {
      const paymentDate = new Date(e?.request_date);
      return paymentDate >= startDate && paymentDate <= endDate && e?.vendor_name === data?.vendor_name && e.status !== 0 && e.status !== 2 && e.status !== 3;
    });

    const totalFY = dataFY?.reduce((acc, item) => acc + parseFloat(item?.payment_amount), 0);

    return totalFY;
  };

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case 'last7Days':
        return apiData.filter((item) => moment(item.request_date).isBetween(now.clone().subtract(7, 'days'), now, 'day', '[]'));
      case 'last30Days':
        return apiData.filter((item) => moment(item.request_date).isBetween(now.clone().subtract(30, 'days'), now, 'day', '[]'));
      case 'thisWeek':
        const startOfWeek = now.clone().startOf('week');
        const endOfWeek = now.clone().endOf('week');
        return apiData.filter((item) => moment(item.request_date).isBetween(startOfWeek, endOfWeek, 'day', '[]'));
      case 'lastWeek':
        const startOfLastWeek = now.clone().subtract(1, 'weeks').startOf('week');
        const endOfLastWeek = now.clone().subtract(1, 'weeks').endOf('week');
        return apiData.filter((item) => moment(item.request_date).isBetween(startOfLastWeek, endOfLastWeek, 'day', '[]'));
      case 'currentMonth':
        const startOfMonth = now.clone().startOf('month');
        const endOfMonth = now.clone().endOf('month');
        return apiData.filter((item) => moment(item.request_date).isBetween(startOfMonth, endOfMonth, 'day', '[]'));
      // case "nextMonth":
      //   const startOfNextMonth = now.clone().add(1, "months").startOf("month");
      //   const endOfNextMonth = now.clone().add(1, "months").endOf("month");
      //   return apiData.filter((item) =>
      //     moment(item.request_date).isBetween(
      //       startOfNextMonth,
      //       endOfNextMonth,
      //       "day",
      //       "[]"
      //     )
      //   );
      case 'currentQuarter':
        const quarterStart = moment().startOf('quarter');
        const quarterEnd = moment().endOf('quarter');
        return apiData.filter((item) => moment(item.request_date).isBetween(quarterStart, quarterEnd, 'day', '[]'));
      case 'today':
        return apiData.filter((item) => moment(item.request_date).isSame(now, 'day'));
      default:
        return apiData;
    }
  };

  const processData = useCallback(
    (data, status) => {
      const filteredData = data?.filter((d) => d.status === status);
      // Calculate the counts
      const pendingCount = filteredData?.length;
      // Aggregate other metrics
      const uniqueVendorCount = new Set(filteredData?.map((item) => item.vendor_name));
      const pendingAmount = filteredData?.reduce((total, item) => total + parseFloat(item.request_amount), 0);
      const balanceAmount = filteredData?.reduce((total, item) => total + parseFloat(item.outstandings), 0);
      const nonGstCount = filteredData?.filter((gst) => gst.gstHold === '0');

      const withInvcImage = filteredData?.filter((item) => item.invc_img && item.invc_img.length > 0);
      const withoutInvcImage = filteredData?.filter((item) => !item.invc_img || item.invc_img.length === 0);
      const tdsDeduction = filteredData?.filter((item) => item?.TDSDeduction === '1' || item?.TDSDeduction === null);

      return {
        pendingCount,
        uniqueVendorCount,
        pendingAmount,
        balanceAmount,
        nonGstCount,
        withInvcImage,
        withoutInvcImage,
        tdsDeduction,
      };
    },
    [data]
  );

  // Use the function for partialData and instantData
  const partialResults = processData(filterData, '3');
  const instantResults = processData(filterData, '0');

  // Destructure the results as needed
  const { pendingCount: pendingPartialCount, uniqueVendorCount: uniqueVendorPartialCount, pendingAmount: pendingAmountPartial, balanceAmount: balanceAmountPartial, nonGstCount: nonGstPartialCount, withInvcImage: withInvcPartialImage, withoutInvcImage: withoutInvcPartialImage, tdsDeduction: partialTDSDeduction } = partialResults;

  const { pendingCount: pendingInstantCount, uniqueVendorCount: uniqueVendorsInstantCount, pendingAmount: pendingAmountInstant, balanceAmount: balanceAmountInstant, nonGstCount: nonGstInstantCount, withInvcImage: withInvcInstantImage, withoutInvcImage: withoutInvcInstantImage, tdsDeduction: instantTDSDeduction } = instantResults;

  useEffect(() => {
    const getUniqueVendorNames = (filterCondition) => {
      const filteredData = filterCondition ? data?.filter(filterCondition) : data;
      const uniqueVendorNames = [...new Set(filteredData?.map((d) => d?.vendor_name))];
      setVendorNameList(uniqueVendorNames);
    };

    switch (activeAccordionIndex) {
      case 0:
        getUniqueVendorNames();
        break;
      case 1:
        getUniqueVendorNames((d) => d?.status === '3');
        break;
      case 2:
        getUniqueVendorNames((d) => d?.status === '0');
        break;
      default:
        setVendorNameList([]);
    }
  }, [activeAccordionIndex, data]);

  useEffect(() => {
    if (activeAccordionIndex === 0 && data?.length) {
      const uniqueVendorNames = [...new Set(data?.map((d) => d?.vendor_name))];
      setVendorNameList(uniqueVendorNames);
    }
  }, [activeAccordionIndex, data]);

  // const handleRowSelectionModelChange = (rowIds) => {
  //   setRowSelectionModel(rowIds);

  //   const isFileUploaded = rowIds?.length > 0 ? 1 : 0;
  //   setIsZohoStatusFileUploaded(isFileUploaded);
  // };

  const handleDownloadInvoices = async () => {
    const zip = new JSZip();

    rowSelectionModel.forEach((rowId) => {
      const rowData = filterData.find((row) => row.request_id === rowId);
      if (rowData) {
        const csvContent = [
          Object.keys(rowData).join(','),
          Object.values(rowData)
            .map((value) => `"${value}"`)
            .join(','),
        ].join('\n');

        zip.file(`invoice_${rowId}.csv`, csvContent);
      }
    });

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'invoices.zip');
    } catch (error) {
      console.error('Error generating zip file:', error);
    }
  };

  // Zoho Status
  const handleZohoStatusUpload = async (row) => {
    try {
      const response = await axios.post('https://purchase.creativefuel.io/webservices/RestController.php?view=updatezohostatus', {
        request_id: row?.request_id,
        zoho_status: '1',
      });

      if (response) {
        toastAlert('Invoice File Uploaded On Zoho Successfully');
        callApi();
      }
    } catch (error) {
      console.error('Error while uploading Zoho status:', error);
    }
  };

  const handleOpenPayThroughVendor = () => {
    setPayThroughVendor(true);
  };
  const handleOpenBulkPayThroughVendor = () => {
    setBulkPayThroughVendor(true);
  };

  const handleClearSameRecordFilter = (e) => {
    e.preventDefault();
    setFilterData(data);
  };
  const handleCheckBalance = async () => {
    setYesBankBalanceProcessing(true);
    // Step 1: Get the JWT token
    const getTokenResponse = await axios.get(insightsBaseUrl + `v1/payment_gateway_access_token`);

    if (getTokenResponse.status == 200) {
      const token = getTokenResponse?.data?.data;
      const tempBalance = axios
        .get(insightsBaseUrl + `v1/get_balance`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data.balance.value, 'tempBalance');
          const tempYesBankBalance = formatNumber(res.data.data.balance.value / 100);
          setYesBankBalance(tempYesBankBalance);
          setYesBankBalanceProcessing(false);
        });
    }
  };

  return (
    <div>
      {/* <FormContainer
        mainTitle="Pending Payment Request"
        link="/admin/finance-pruchasemanagement-pendingpaymentrequest"
        uniqueVendorCount={uniqueVendorCount}
        totalPendingAmount={totalPendingAmount}
        totalBalanceAmount={totalBalanceAmount}
        pendingRequestCount={pendingRequestCount}
        pendingPartialcount={pendingPartialCount}
        pendingInstantcount={pendingInstantCount}
        uniqueVendorPartialCount={uniqueVendorPartialCount}
        uniqueVendorsInstantCount={uniqueVendorsInstantCount}
        pendingAmountPartial={pendingAmountPartial}
        pendingAmountInstant={pendingAmountInstant}
        balanceAmountPartial={balanceAmountPartial}
        balanceAmountInstant={balanceAmountInstant}
        nonGstPartialCount={nonGstPartialCount}
        nonGstInstantCount={nonGstInstantCount}
        withInvcPartialImage={withInvcPartialImage}
        withInvcInstantImage={withInvcInstantImage}
        withoutInvcPartialImage={withoutInvcPartialImage}
        withoutInvcInstantImage={withoutInvcInstantImage}
        nonGstCount={nonGstCount}
        invoiceCount={invoiceCount}
        nonInvoiceCount={nonInvoiceCount}
        accIndex={activeAccordionIndex}
        handleOpenUniqueVendorClick={handleOpenUniqueVendorClick}
        includeAdditionalTitles={true}
        pendingpaymentRemainder={phpRemainderData.length}
        tdsDeductedCount={tdsDeductedCount}
        partialTDSDeduction={partialTDSDeduction}
        instantTDSDeduction={instantTDSDeduction}
      /> */}

      {/* Bank Details 14 */}

      <BankDetailPendingPaymentDialog bankDetail={bankDetail} handleCloseBankDetail={handleCloseBankDetail} bankDetailRowData={bankDetailRowData} />
      {/* Payment History */}
      <CommonDialogBox
        dialog={paymentHistory}
        handleCloseDialog={handleClosePaymentHistory}
        activeAccordionIndex={0}
        data={historyData}
        columnsData={pendingPaymentDetailColumns({
          historyData,
          nodeData,
        })}
      />
      {/* Unique Vendor Dialog Box */}
      <CommonDialogBox
        dialog={uniqueVenderDialog}
        handleCloseDialog={handleCloseUniqueVendor}
        activeAccordionIndex={activeAccordionIndex}
        data={uniqueVendorData}
        columnsData={pendingPaymentUniqueVendorColumns({
          activeAccordionIndex,
          uniqueVendorData,
          handleOpenSameVender,
          filterData,
        })}
      />
      {/* Overview Dialog Box */}
      <OverviewContainedDialog
        setOverviewDialog={setOverviewDialog}
        overviewDialog={overviewDialog}
        filterData={filterData}
        // data={}
        columns={pendingPaymentRequestColumns({
          activeAccordionIndex,
          filterData,
          setOpenImageDialog,
          setViewImgSrc,
          phpRemainderData,
          handleRemainderModal,
          handleOpenBankDetail,
          handleOpenSameVender,
          handleOpenPaymentHistory,
          getStatusText,
          handlePayClick,
          handleDiscardClick,
          handleZohoStatusUpload,
          nodeData,
        })}
      />

      <PendingPaymentReqFilters setDateFilter={setDateFilter} dateFilter={dateFilter} data={data} setVendorNameList={setVendorNameList} vendorNameList={vendorNameList} setOverviewDialog={setOverviewDialog} setFilterData={setFilterData} handleOpenOverview={handleOpenOverview} />

      <>
        <div className="tab">
          {accordionButtons.map((button, index) => (
            <div key={index} className={`named-tab ${activeAccordionIndex === index ? 'active-tab' : ''}`} onClick={() => handleAccordionButtonClick(index)}>
              {button}
            </div>
          ))}
        </div>
        <div>
          {(activeAccordionIndex === 0 || activeAccordionIndex === 1 || activeAccordionIndex === 2) && (
            <View
              columns={pendingPaymentRequestColumns({
                activeAccordionIndex,
                filterData,
                setOpenImageDialog,
                setViewImgSrc,
                phpRemainderData,
                handleRemainderModal,
                handleOpenBankDetail,
                handleOpenSameVender,
                handleOpenPaymentHistory,
                getStatusText,
                handlePayClick,
                handleDiscardClick,
                handleZohoStatusUpload,
                nodeData,
              })}
              data={activeAccordionIndex === 0 ? filterData : activeAccordionIndex === 1 ? filterData?.filter((d) => d.status === '3') : activeAccordionIndex === 2 ? filterData?.filter((d) => d.status === '0') : []}
              isLoading={requestLoading}
              showTotal={true}
              title={'Pending Payment Request'}
              rowSelectable={true}
              pagination={[100, 200]}
              tableName={'finance-pending-payment-request'}
              selectedData={setSelectedRows}
              addHtml={
                <>
                  <p className="btn cmnbtn btn_sm ms-2">{yesBankBalance}</p>
                  <button className="btn cmnbtn btn_sm btn-primary ms-2" onClick={(e) => handleCheckBalance(e)} disabled={yesBankBalanceProcessing}>
                    Check Balance
                  </button>
                  <button className="btn cmnbtn btn_sm btn-primary ms-2" onClick={() => refetchPaymentRequerst()}>
                    Refetch
                  </button>
                  <button className="btn cmnbtn btn_sm btn-secondary ms-2" onClick={(e) => handleClearSameRecordFilter(e)}>
                    Clear
                  </button>
                  <button className="btn btn-success cmnbtn btn_sm ms-2" variant="contained" color="primary" size="small" onClick={handleOpenBulkPayThroughVendor}>
                    Bulk Pay Through Vendor
                  </button>
                </>
              }
            />
          )}
          {openImageDialog && <ImageView viewImgSrc={viewImgSrc} fullWidth={true} maxWidth={'md'} setViewImgDialog={setOpenImageDialog} openImageDialog={openImageDialog} />}
        </div>

        {openImageDialog && <ImageView viewImgSrc={viewImgSrc} fullWidth={true} maxWidth={'md'} setViewImgDialog={setOpenImageDialog} openImageDialog={openImageDialog} />}
        {payThroughVendor && <PayThroughVendorDialog setPayThroughVendor={setPayThroughVendor} payThroughVendor={payThroughVendor} rowSelectionModel={selectedRows} filterData={filterData} />}
        {bulkPayThroughVendor && <BulkPayThroughVendorDialog setBulkPayThroughVendor={setBulkPayThroughVendor} bulkPayThroughVendor={bulkPayThroughVendor} rowSelectionModel={selectedRows} filterData={filterData} />}
        {payDialog && <PayVendorDialog callApi={refetchPaymentRequerst} userName={userName} loading={loading} setLoading={setLoading} phpRemainderData={phpRemainderData} rowData={rowData} setRowData={setRowData} paymentAmout={paymentAmout} setPaymentAmount={setPaymentAmount} netAmount={netAmount} setNetAmount={setNetAmount} baseAmount={baseAmount} setBaseAmount={setBaseAmount} payDialog={payDialog} setPayDialog={setPayDialog} rowSelectionModel={selectedRows} filterData={filterData} GSTHoldAmount={GSTHoldAmount} setGSTHoldAmount={setGSTHoldAmount} refetch={refetch} setRefetch={refetchPaymentRequerst} />}
        {/* <ZohoBillCreation
          rowData={rowData}
          paymentAmout={paymentAmout}
          userName={userName}
          GSTHoldAmount={GSTHoldAmount} setGSTHoldAmount={setGSTHoldAmount}
          TDSValue={TDSValue} setTDSValue={setTDSValue}
        /> */}

        {showDisCardModal && <DiscardConfirmation userName={userName} rowData={rowData} setShowDiscardModal={setShowDiscardModal} userID={userID} callApi={refetchPaymentRequerst} />}

        {remainderDialog && (
          <ShowDataModal
            handleClose={setRemainderDialog}
            rows={reminderData}
            columns={pendingPaymentReqRemainderDialogColumns({
              reminderData,
              handleAcknowledgeClick,
            })}
            aknowledgementDialog={aknowledgementDialog}
            setAknowledgementDialog={setAknowledgementDialog}
            userName={userName}
            callApi={refetchPaymentRequerst}
            setRemainderDialo={setRemainderDialog}
          />
        )}
      </>
    </div>
  );
}
