import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetVendorInventoryQuery } from "../../Store/API/VendorSale/VendorSaleApi";
import { TextField } from "@mui/material";
import View from "../Sales/Account/View/View";
import formatString from "../../../utils/formatString";

const VendorInventoryDetails = () => {
  const { id } = useParams();
  const {
    data: vendorInventoryData,
    error: vendorInventoryError,
    isLoading: isVendorInventoryLoading,
  } = useGetVendorInventoryQuery(id);

  const formatPriceKeyToLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generateDynamicPriceColumns = (sampleRow) => {
    const priceKeys = Object.keys(sampleRow?.price_list?.[0] || {});

    return priceKeys.map((key) => ({
      key: `${key}_price`,
      name: formatPriceKeyToLabel(key),
      width: 160,
      renderRowCell: (row) => row?.price_list?.[0]?.[key] ?? "-",
    }));
  };

  const sampleRow = vendorInventoryData?.data?.[0];
  const dynamicPriceColumns = generateDynamicPriceColumns(sampleRow);
  const columns = [
    {
      key: "page_name",
      name: "Page Name",
      width: 300,
      renderRowCell: (row) => formatString(row?.page_name),
    },
    {
      key: "platform_name",
      name: "Platform",
      width: 300,
      renderRowCell: (row) => formatString(row?.platform_name),
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 300,
      renderRowCell: (row) => row?.vendor_name,
    },
    ...dynamicPriceColumns,
  ];

  return (
    <div>
      <div>
        <View
          version={1}
          columns={columns}
          data={vendorInventoryData?.data}
          isLoading={isVendorInventoryLoading}
          title="Vendor Pages"
          rowSelectable={true}
          pagination={[10, 50, 100]}
          tableName="Vendor Pages"
          addHtml={
            <div className="flexCenterBetween colGap8 ml-auto">
              <Link to={`/admin/vendor-pages/${id}`}> Add Pages</Link>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default VendorInventoryDetails;
