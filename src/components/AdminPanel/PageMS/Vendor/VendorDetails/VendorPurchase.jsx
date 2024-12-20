import axios from "axios";
import React, { useEffect, useState } from "react";
import View from "../../../Sales/Account/View/View";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const  VendorPurchase = ({ vendorDetails }) => {
  const [purchaseData, setPurchaseData] = useState([]);

  const getPurchaseData = async () => {
    const res = await axios.post(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=getvendordata`,
      { vendor_id: vendorDetails?.vendor_id }
    );
    setPurchaseData(res?.data?.body);
  }

  useEffect(() => {
    getPurchaseData();
  }, [vendorDetails]);
  
  const dataSecondGridColumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },

    {
      key: "vendor_name",
      name: "Vendor Name ",
      width: 200,
    },
    {
      key: "purchase_type",
      name: "Purchase Type",
      width: 200,
    },
    {
      key: "total_credit_amount",
      name: "Total Credit Amount ",
      width: 200,
    },
    {
      key: "total_forms",
      name: "Total Form  ",
      width: 200,
    },
    {
      key: "total_purchase_amount",
      name: "Total Purchase Amount  ",
      width: 200,
    },
  ];

  return (
    <div>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Purchase{" "}
          </AccordionSummary>
          <AccordionDetails className="p0 border-0">
            <View
              columns={dataSecondGridColumns}
              data={purchaseData}
              isLoading={false}
              title={"Purchase Vendor Data"}
              rowSelectable={true}
              pagination={[100, 200, 1000]}
              tableName={"Purchase Vendor Data"}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default VendorPurchase;
