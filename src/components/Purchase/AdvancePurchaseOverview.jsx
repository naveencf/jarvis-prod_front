import React, { useState } from "react";
import {
  useGetPageWiseAdvancedPaymentDetailsQuery,
  useGetVendorWiseAdvancedPaymentDetailsQuery,
  useLazyGetAdvancePaymentsByPageAndVendorQuery,
} from "../Store/API/Purchase/DirectPurchaseApi";
import View from "../AdminPanel/Sales/Account/View/View";
import formatString from "../AdminPanel/Operation/CampaignMaster/WordCapital";
import { skipToken } from "@reduxjs/toolkit/query";

const AdvancePurchaseOverview = () => {
  const [activeTab, setActiveTab] = useState("Tab0");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [viewContext, setViewContext] = useState(null);
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    error: vendorError,
  } = useGetVendorWiseAdvancedPaymentDetailsQuery();

  const {
    data: pageData,
    isLoading: isPageLoading,
    error: pageError,
  } = useGetPageWiseAdvancedPaymentDetailsQuery();

  const [
    triggerGetAdvancePayments,
    {
      data: advanceByPageVendor,
      isLoading: advanceLoading,
      isFetching: advanceFetching,
    },
  ] = useLazyGetAdvancePaymentsByPageAndVendorQuery(
    selectedFilter ? selectedFilter : skipToken
  );

  const handleNameClick = ({ vendor_obj_id, vendor_name, page_name }) => {
    if (vendor_obj_id) {
      setSelectedFilter({ vendor_obj_id });
      setViewContext({ type: "vendor", label: vendor_name });
      triggerGetAdvancePayments({ vendor_obj_id });
    } else if (page_name) {
      setSelectedFilter({ page_name });
      setViewContext({ type: "page", label: page_name });
      triggerGetAdvancePayments({ page_name });
    }
  };

  const pagesWithoutUpfront = pageData?.filter(
    (item) => item.is_upfront === false
  );
  const pagesWithUpfront = pageData?.filter((item) => item.is_upfront === true);
  const isDefaultView = !selectedFilter;
  const isLoading =
    selectedFilter !== null
      ? advanceLoading || advanceFetching
      : activeTab === "Tab0"
      ? isPageLoading
      : isVendorLoading;

  const tableData = selectedFilter
    ? advanceByPageVendor
    : activeTab === "Tab0"
    ? pagesWithoutUpfront
    : activeTab === "Tab2"
    ? pagesWithUpfront
    : vendorData;
  const advancedPaymentData = viewContext ? advanceByPageVendor : tableData;

  const calculateAdvanceAmount = (row) => {
    if (activeTab !== "Tab1") {
      const val = row?.advance_amount || 0;
      return Math.floor(val);
    } else {
      const val = row?.total_advance_amount || 0;
      return Math.floor(val);
    }
  };
  const calculateRemainingAdvanceAmount = (row) => {
    if (activeTab !== "Tab1") {
      const val = (row?.remaining_advance_amount || 0) - (row?.gst_amount || 0);
      console.log("val", row);
      return Math.floor(val);
    } else {
      const val =
        (row?.total_remaining_advance_amount || 0) -
        (row?.total_gst_amount || 0);
      return Math.floor(val);
    }
  };

  const columns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
      showCol: true,
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 180,
      renderRowCell: (row) =>
        row?.vendor_name ? (
          <span
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleNameClick({
                vendor_obj_id: row.vendor_obj_id,
                vendor_name: row.vendor_name,
              })
            }
            disabled={!isDefaultView}
          >
            {formatString(row?.vendor_name)}
          </span>
        ) : (
          "NA"
        ),
    },
    ...(activeTab !== "Tab1"
      ? [
          {
            key: "page_name",
            name: "Page Name",
            width: 180,
            renderRowCell: (row) =>
              row?.page_name ? (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNameClick({ page_name: row.page_name })}
                  disabled={!isDefaultView}
                >
                  {formatString(row?.page_name)}
                </span>
              ) : (
                "NA"
              ),
          },
        ]
      : []),
    {
      key: "advance_amount",
      name: "Advance Amount",
      width: 160,
      renderRowCell: (row) => <span>{calculateAdvanceAmount(row)}</span>,
    },
    ...(activeTab !== "Tab1"
      ? [
          {
            key: "remaining_advance_amount",
            name: "Remaining Post",
            width: 180,
            renderRowCell: (row) =>
              Math.floor(
                ((row?.remaining_advance_amount || 0) -
                  (row?.gst_amount || 0)) /
                  (row?.at_price || 1)
              ) || 0,
          },
        ]
      : []),
    {
      key: "remaining_advance_amount",
      name: "Remaining Advance",
      width: 150,
      renderRowCell: (row) => calculateRemainingAdvanceAmount(row),
    },
    {
      key: "gst_amount",
      name: "GST Amount",
      width: 150,
      renderRowCell: (row) => row?.gst_amount ?? "NA",
    },
    ...(activeTab !== "Tab1"
      ? [
          {
            key: "no_of_post",
            name: "Purchased post",
            width: 140,
            renderRowCell: (row) => row?.no_of_post ?? "NA",
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="tabs mb-4 flex gap-4">
        <button
          className={
            activeTab === "Tab0" ? "btn btn-primary" : "btn btn-outline"
          }
          onClick={() => {
            setActiveTab("Tab0");
            setSelectedFilter(null);
          }}
        >
          Page Wise
        </button>
        <button
          className={
            activeTab === "Tab1" ? "btn btn-primary" : "btn btn-outline"
          }
          onClick={() => {
            setActiveTab("Tab1");
            setSelectedFilter(null);
          }}
        >
          Vendor Wise
        </button>
        <button
          className={
            activeTab === "Tab2" ? "btn btn-primary" : "btn btn-outline"
          }
          onClick={() => {
            setActiveTab("Tab2");
            setSelectedFilter(null);
          }}
        >
          Upfront Payment
        </button>
      </div>

      {viewContext && (
        <button
          className="btn btn-warning btn-sm btn-outline mb-4 "
          onClick={() => {
            setSelectedFilter(null);
            setViewContext(null);
          }}
        >
          ⬅ Go Back
        </button>
      )}

      <View
        version={1}
        columns={columns}
        data={advancedPaymentData}
        isLoading={advanceLoading || isLoading}
        title={
          viewContext
            ? `${
                viewContext.type === "vendor" ? "Vendor" : "Page"
              } Overview - ${viewContext.label}`
            : activeTab === "Tab0"
            ? "Page Wise Advance Overview"
            : "Vendor Wise Advance Overview"
        }
        tableName={
          viewContext
            ? `${
                viewContext.type === "vendor" ? "Vendor" : "Page"
              } Overview - ${viewContext.label}`
            : "Advance Purchase Overview"
        }
        rowSelectable={true}
        pagination={[100, 200, 1000]}
      />
    </div>
  );
};

export default AdvancePurchaseOverview;
