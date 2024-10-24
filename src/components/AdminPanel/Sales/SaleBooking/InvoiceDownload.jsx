import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import axios from "axios";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import { fi } from "date-fns/locale";

const InvoiceDownload = ({ taxInvoiceData, closeModal }) => {
  const token = sessionStorage.getItem("token");
  const [links, setLinks] = useState([]);
  const [isloading, setIsloading] = useState(false);


  useEffect(() => {
    const fetchInvoiceLinks = async () => {
      setIsloading(true);
      try {
        const response = await axios.get(
          `${baseUrl}sales/invoice_request?sale_booking_id=${taxInvoiceData?.sale_booking_id}&invoice_type_id=tax-invoice&status=uploaded`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLinks(response.data.data); // Assuming the response structure contains a 'links' array
      } catch (error) {
        console.error("Error fetching invoice links:", error);
      }
      finally {
        setIsloading(false);
      }
    };

    fetchInvoiceLinks();
  }, []);

  const columns = [
    {
      key: "s.no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "date",
      name: "Date",
      renderRowCell: (row) => DateISOtoNormal(row.createdAt),
      width: 150,
    },
    {
      key: "view",
      name: "View",
      renderRowCell: (row) => <a
        className="icon-1"
        href={row.invoice_file_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="bi bi-eye" />
      </a>,
      width: 100,
    },

  ]

  return (
    <div>
      <div className="sb mb-2 mt-2">
        <div>

        </div>
        <button className="icon-1" onClick={closeModal}>x</button>
      </div>

      <View
        data={links}
        columns={columns}
        isLoading={isloading}
        tableName={"Sales-Invoice"}
        pagination
        title={"Invoice Details"}
      />



    </div>
  );
};

export default InvoiceDownload;
