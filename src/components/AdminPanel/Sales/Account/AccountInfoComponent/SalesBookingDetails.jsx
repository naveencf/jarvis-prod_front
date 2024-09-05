import React, { useEffect, useState } from "react";
import { useGetListOfIndividualSaleBookingQuery } from "../../../../Store/API/Sales/SaleBookingApi";
import CustomTable from "../../../../CustomTable/CustomTable";
import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";
import { baseUrl } from "../../../../../utils/config";
import axios from "axios";
import Modal from "react-modal";
// import { useGetSingleRecordServiceQuery } from "../../../../Store/API/Sales/RecordServicesApi";
import RecordServicesData from "./RecordServicesData";
import getDecodedToken from "../../../../../utils/DecodedToken";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../../../Finance/Loader/Loader";

const SalesBookingDetails = ({ SingleAccount }) => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }

  const [userLoading, setUserLoading] = useState(false);
  const [userContextData, setUserContextData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  // const {
  //   data: SingleRecordData,
  //   error: SingleRecordError,
  //   isLoading: SingleRecordLoading,
  // } = useGetSingleRecordServiceQuery();
  const {
    data: SalesData,
    error: SalesError,
    isLoading: SalesLoading,
  } = useGetListOfIndividualSaleBookingQuery(
    SingleAccount?.account_id,
    loginUserId,
    { skip: !SingleAccount?.account_id }
  );

  async function getAllUserData() {
    setUserLoading(true);
    try {
      const res = await axios.get(baseUrl + "get_all_users").then((res) => {
        setUserContextData(res?.data.data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  }
  useEffect(() => {
    getAllUserData();
  }, []);
  function openModal(row) {
    setIsModalOpen(true);
    setModalData(row);
  }
  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 20,
      showCol: true,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      showCol: true,
      width: 100,
    },
    // {
    //   key: "customer_name",
    //   name: "Account name",
    //   renderRowCell: (row) =>
    //     allAccount?.find((account) => account.account_id === row.account_id)
    //       ?.account_name,
    //   showCol: true,
    //   width: 100,
    // },
    {
      key: "created_by",
      name: "Sales Executive name",
      renderRowCell: (row) =>
        userContextData?.find((user) => user?.user_id === row?.created_by)
          ?.user_name,
      showCol: true,
      width: 100,
    },
    {
      key: "sale_booking_date",
      name: "Booking Date",
      renderRowCell: (row) => DateISOtoNormal(row.sale_booking_date),
      showCol: true,
      width: 100,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount / Net Amount",
      renderRowCell: (row) => row.campaign_amount + "₹",
      showCol: true,
      width: 100,
    },

    {
      key: "base_amount",
      name: "Base Amount",
      renderRowCell: (row) => row.base_amount + "₹",
      showCol: true,
      width: 100,
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      renderRowCell: (row) => row.gst_amount + "₹",
      showCol: true,
      width: 100,
    },

    // {
    //   key: "service_taken_amount",
    //   name: "Service Taken Amount",
    //   renderRowCell: (row) => row.service_taken_amount + "₹",
    //   showCol: true,
    //   width: 100,
    // },

    {
      key: "incentive_status",
      name: "Incentive",
      renderRowCell: (row) =>
        row.incentive_status === "incentive" ? "Yes" : "No",
      showCol: true,
      width: 100,
    },

    {
      key: "createdAt",
      name: "Booking Date Created",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      showCol: true,
      width: 100,
    },
    {
      key: "record",
      name: "Record Service",
      renderRowCell: (row) => (
        <button className="icon-1" onClick={() => openModal(row)}>
          <i className="bi bi-eye"></i>
        </button>
      ),
      width: 50,
    },
  ];
  return (
    <>
      {SalesLoading && <Loader />}
      <div className="SalesBookingDetail">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={{
            content: {
              width: "60%",
              height: "80%",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <RecordServicesData modalData={modalData} />
        </Modal>
      </div>

      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Sales Booking Details
          </AccordionSummary>
          <AccordionDetails className="p0 border-0">
            <CustomTable
              isLoading={SalesLoading || userLoading}
              columns={columns}
              data={SalesData}
              Pagination
              tableName={"SalesBookingDetails"}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default SalesBookingDetails;
