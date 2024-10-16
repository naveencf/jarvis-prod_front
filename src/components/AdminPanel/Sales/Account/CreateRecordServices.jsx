import React, { useState, useEffect } from "react";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import FieldContainer from "../../FieldContainer";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";
import { set } from "date-fns"
  ;

const RecordServices = ({
  records,
  setRecords,
  serviceTypes,
  baseAmount,
  setValidateService,
  isValidRec,
  setIsValidRec,
  getincentiveSharingData,
}) => {
  const { usersDataContext } = useGlobalContext();

  const { editId } = useParams();
  const [selectedRecords, setSelectedRecords] = useState(
    records?.map(() => "")
  );
  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [error, setError] = useState(""); // New state for error handling

  const { toastError } = useGlobalContext();
  useEffect(() => {
    if (serviceFieldsData.length > 0) {
      setValidateService(serviceFieldsData);
    }
  }, [serviceFieldsData]);

  useEffect(() => {
    if (records && serviceTypes) {
      setSelectedRecords(
        records.map((record) => record.sales_service_master_id)
      );

      if (editId !== undefined) {
        const updatedServiceFieldsData = records.map((record, index) => {
          return (
            serviceTypes.find(
              (service) => service._id === record.sales_service_master_id
            ) ||
            serviceFieldsData[index] ||
            {}
          );
        });

        setServiceFieldsData(updatedServiceFieldsData);
        setValidateService(updatedServiceFieldsData);
      }
    }
  }, [serviceTypes, records, editId]);

  useEffect(() => {
    // Calculate remaining amount on initial render and when records or baseAmount change
    const totalAmount = records?.reduce(
      (total, record) => total + (parseFloat(record.amount) || 0),
      0
    );

    if (baseAmount > totalAmount) {
      setRemainingAmount(baseAmount - totalAmount);
    } else {
      setRemainingAmount(0);
    }
  }, [records, baseAmount]);

  const handleRecordChange = (index, key, value) => {
    if (value < 0) {
      toastError("Amount cannot be negative");
      return;
    }
    const updatedRecords = records?.map((record, recordIndex) =>
      recordIndex === index ? { ...record, [key]: value } : record
    );



    setIsValidRec((prev) =>
      prev.map((rec, recIndex) =>
        recIndex === index ? { ...rec, [key]: false } : rec
      )
    );

    // Validate total amount if key is 'amount'
    if (key === "amount") {
      const totalAmount = updatedRecords.reduce(
        (total, record) => total + (parseFloat(record.amount) || 0),
        0
      );

      if (baseAmount > totalAmount) {
        setRemainingAmount(baseAmount - totalAmount);
      }

      if (totalAmount > baseAmount) {
        toastError(`Total amount cannot exceed ${baseAmount}`);
        return; // Early return if validation fails
      }
    }

    setRecords(updatedRecords);

    if (key === "excel_upload" && value instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result;
        const combinedString = JSON.stringify({
          data: binaryString,
          name: value.name,
        });
        const updatedRecordsWithBinary = records?.map((record, recordIndex) =>
          recordIndex === index
            ? { ...record, excel_upload: combinedString }
            : record
        );

        setRecords(updatedRecordsWithBinary);
      };
      reader.readAsBinaryString(value);
    }

    if (key === "sales_service_master_id") {


      const updatedSelectedRecords = [...selectedRecords];
      updatedSelectedRecords[index] = value;
      const updatedServiceFieldsData = [...serviceFieldsData];
      updatedServiceFieldsData[index] = serviceTypes?.find(
        (service) => service?._id === value
      );

      setSelectedRecords(updatedSelectedRecords);
      setServiceFieldsData(updatedServiceFieldsData);

    }
  };

  const handleDeleteRecord = (index) => {
    const updatedRecords = [...records];
    const updatedIsValidRec = [...isValidRec];
    updatedRecords.splice(index, 1);
    updatedIsValidRec.splice(index, 1);
    setIsValidRec(updatedIsValidRec);
    setRecords(updatedRecords);

    const updatedSelectedRecords = [...selectedRecords];
    updatedSelectedRecords.splice(index, 1);
    setSelectedRecords(updatedSelectedRecords);

    const updatedServiceFieldsData = [...serviceFieldsData];
    updatedServiceFieldsData.splice(index, 1);
    setServiceFieldsData(updatedServiceFieldsData);
    setValidateService(updatedServiceFieldsData);
  };

  const getAvailableServiceTypes = (currentIndex) => {
    const selectedTypes = selectedRecords?.map((record) => record);

    return serviceTypes?.filter(
      (type) =>
        (!selectedTypes?.includes(type._id) ||
          type._id === selectedRecords[currentIndex]) &&
        type.status == 0
    );
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}{" "}
      {records?.map((record, index) => {
        const ServiceFields = serviceFieldsData?.[index];
        const isValidRecIndex = isValidRec?.[index];


        return (
          <div className="card" key={index}>
            <div className="card-header sb">
              <h4>Record {index + 1}</h4>
              <button
                className="icon-1"
                onClick={() => handleDeleteRecord(index)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
            <div className="card-body">
              <div className="row record-container">

                <div className="col-12">
                  {
                    getincentiveSharingData?.services?.find(data => data.service_id === record?.sales_service_master_id)?.service_percentage  &&
                    <div className="card gstinfo-card">

                      {
                        <div>
                          <h5>

                            {record?.sales_service_master_id ? "Service Percentage" + " " + getincentiveSharingData?.services?.find(data => data.service_id === record?.sales_service_master_id)?.service_percentage + "%" : "Please Select Service Type"}

                          </h5>
                        </div>
                      }
                      <div className="flex-grid gap-2 ">

                        {
                          getincentiveSharingData?.services?.find(data => data?.service_id === record?.sales_service_master_id)?.incentive_sharing_users?.map((data, index) => (
                            <div key={index} className="sb gap-2  cmnbtn btn btn_sm">
                              <p>{usersDataContext?.find(user => user?.user_id === data?.user_id)?.user_name}</p>
                              <p>{data?.user_percentage + "%"}</p>
                            </div>
                          ))
                        }
                      </div>

                    </div>
                  }
                </div>
                <div className="col-6">
                  <CustomSelect
                    label="Service Type"
                    fieldGrid={12}
                    dataArray={getAvailableServiceTypes(index)}
                    optionId="_id"
                    optionLabel="service_name"
                    selectedId={record.sales_service_master_id}
                    setSelectedId={(value) =>
                      handleRecordChange(
                        index,
                        "sales_service_master_id",
                        value
                      )
                    }
                    required
                  />
                  {isValidRecIndex?.sales_service_master_id === true && (
                    <div className="form-error">Please Select Service Type</div>
                  )}
                </div>
                <div className="col-6">
                  <FieldContainer
                    label="Amount"
                    placeholder="Enter Amount"
                    type="number"
                    fieldGrid={12}
                    value={record.amount || ""}
                    onChange={(e) =>
                      handleRecordChange(index, "amount", e.target.value)
                    }
                    required
                    astric
                  />
                  {isValidRecIndex?.amount === true && (
                    <div className="form-error">Please Enter Amount</div>
                  )}
                  Remaining amount:
                  <span style={{ color: "green" }}> {remainingAmount}</span>
                </div>

                {ServiceFields?.no_of_hours_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Number of Hours"
                      placeholder="Enter Number of Hours"
                      type="number"
                      fieldGrid={12}
                      value={record.no_of_hours || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "no_of_hours", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.no_of_hours === true && (
                      <div className="form-error">
                        Please Enter Number of Hours
                      </div>
                    )}
                  </div>
                )}

                {ServiceFields?.goal_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Goal"
                      placeholder="Enter Goal"
                      type="text"
                      fieldGrid={12}
                      value={record.goal || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "goal", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.goal === true && (
                      <div className="form-error">Please Enter Goal</div>
                    )}
                  </div>
                )}

                {ServiceFields?.day_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Day"
                      placeholder="Enter Day"
                      type="number"
                      fieldGrid={12}
                      value={record.day || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "day", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.day === true && (
                      <div className="form-error">Please Enter Day</div>
                    )}
                  </div>
                )}

                {ServiceFields?.quantity_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Quantity"
                      placeholder="Enter Quantity"
                      type="number"
                      fieldGrid={12}
                      value={record.quantity || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "quantity", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.quantity === true && (
                      <div className="form-error">Please Enter Quantity</div>
                    )}
                  </div>
                )}

                {ServiceFields?.brand_name_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Brand Name"
                      placeholder="Enter Brand Name"
                      type="text"
                      fieldGrid={12}
                      value={record.brand_name || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "brand_name", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.brand_name === true && (
                      <div className="form-error">Please Enter Brand Name</div>
                    )}
                  </div>
                )}

                {ServiceFields?.hashtag && (
                  <div className="col-6">
                    <FieldContainer
                      label="Hashtag"
                      placeholder="Enter Hashtag"
                      type="text"
                      fieldGrid={12}
                      value={record.hashtag || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "hashtag", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.hashtag === true && (
                      <div className="form-error">Please Enter Hashtag</div>
                    )}
                  </div>
                )}

                {ServiceFields?.indiviual_amount_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Individual Amount"
                      placeholder="Enter Individual Amount"
                      type="number"
                      fieldGrid={12}
                      value={record.individual_amount || ""}
                      onChange={(e) =>
                        handleRecordChange(
                          index,
                          "individual_amount",
                          e.target.value
                        )
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.individual_amount === true && (
                      <div className="form-error">
                        Please Enter Individual Amount
                      </div>
                    )}
                  </div>
                )}

                {ServiceFields?.start_end_date_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Start Date"
                      placeholder="Enter Start Date"
                      type="date"
                      fieldGrid={12}
                      value={
                        record.start_date ? record.start_date.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        handleRecordChange(index, "start_date", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.start_date === true && (
                      <div className="form-error">Please Enter Start Date</div>
                    )}
                  </div>
                )}

                {ServiceFields?.start_end_date_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="End Date"
                      placeholder="Enter End Date"
                      type="date"
                      fieldGrid={12}
                      value={
                        record.end_date ? record.end_date.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        handleRecordChange(index, "end_date", e.target.value)
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.end_date === true && (
                      <div className="form-error">Please Enter End Date</div>
                    )}
                  </div>
                )}

                {ServiceFields?.per_month_amount_status && (
                  <div className="col-6">
                    <FieldContainer
                      label="Per Month Amount"
                      placeholder="Enter Per Month Amount"
                      type="number"
                      fieldGrid={12}
                      value={record.per_month_amount || ""}
                      onChange={(e) =>
                        handleRecordChange(
                          index,
                          "per_month_amount",
                          e.target.value
                        )
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.per_month_amount === true && (
                      <div className="form-error">
                        Please Enter Per Month Amount
                      </div>
                    )}
                  </div>
                )}

                {ServiceFields?.no_of_creators && (
                  <div className="col-6">
                    <FieldContainer
                      label="Number of Creators"
                      placeholder="Enter Number of Creators"
                      type="number"
                      fieldGrid={12}
                      value={record.no_of_creators || ""}
                      onChange={(e) =>
                        handleRecordChange(
                          index,
                          "no_of_creators",
                          e.target.value
                        )
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.no_of_creators === true && (
                      <div className="form-error">
                        Please Enter Number of Creators
                      </div>
                    )}
                  </div>
                )}

                {ServiceFields?.deliverables_info && (
                  <div className="col-6">
                    <FieldContainer
                      label="Deliverables Info"
                      placeholder="Enter Deliverables Info"
                      type="text"
                      fieldGrid={12}
                      value={record.deliverables_info || ""}
                      onChange={(e) =>
                        handleRecordChange(
                          index,
                          "deliverables_info",
                          e.target.value
                        )
                      }
                      required
                      astric
                    />
                    {isValidRecIndex?.deliverables_info === true && (
                      <div className="form-error">
                        Please Enter Deliverables Info
                      </div>
                    )}
                  </div>
                )}

                {ServiceFields?.remarks && (
                  <div className="col-6">
                    <FieldContainer
                      label="Remarks"
                      placeholder="Enter Remarks"
                      type="text"
                      fieldGrid={12}
                      value={record.remarks || ""}
                      onChange={(e) =>
                        handleRecordChange(index, "remarks", e.target.value)
                      }
                      // required
                      astric
                    />
                    {isValidRecIndex?.remarks === true && (
                      <div className="form-error">Please Enter Remarks</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RecordServices;
