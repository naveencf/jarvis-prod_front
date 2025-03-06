import React, { useState, useEffect, useCallback, use } from 'react'
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { ApiContextData } from '../../APIContext/APIContext';
import FieldContainer from '../../FieldContainer';

const ServiceIncentiveSharing = ({

    allSalesServiceData,
    selectedService,
    loginUser,
    userContextData,
    incentiveSharing,
    setIncentiveSharing,
    serviceField,
    setServiceField,
    allSalesService,
    setSelectedService,
    editFlag,
    setExecutiveEditFlag,
    executiveEditFlag,
    editIndex,
    insetServiceIncentivePercentage,
    userRole,
    accountInfo,

}) => {
    const [selectedExecutive, setSelectedExecutive] = useState();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [executiveFields, setExecutiveFields] = useState([]);

    const [serviceIncentivePercentage, setServiceIncentivePercentage] = useState(100);


    useEffect(() => {
        // Filter the userContextData to exclude users already in executiveFields
        const filteredUsers = userContextData?.filter(user =>
            !executiveFields?.some(field => field?.user_id === user?.user_id)
        );
        setAvailableUsers(filteredUsers);
    }, [executiveFields, userContextData]);


    useEffect(() => {
        setServiceIncentivePercentage(pre => {

            if (pre > 100 || pre === undefined) {
                return 100;
            } else if (pre < 0) {
                return 0;
            }
            return pre;

        })
    }, [serviceIncentivePercentage])



    useEffect(() => {
        if (selectedService) {
            setServiceIncentivePercentage(
                serviceField?.find((field) => field?.service_id === selectedService)?.service_percentage
            );
        }
    }, [selectedService, executiveEditFlag, serviceField]);




    const handleExecutiveSelect = (executiveId, percent, isprev) => {
        console.log(executiveId, percent, "inside handleExecutiveSelect");

        setAvailableUsers((prevAvailableUsers) => {
            const selectedUser = prevAvailableUsers?.find(
                (user) => user?.user_id === executiveId
            );
            console.log(selectedUser, "selectedUser");

            if (selectedUser) {
                setSelectedExecutive(executiveId);

                // Use functional update to ensure the latest state is captured
                setExecutiveFields((prevExecFields) => {
                    const executiveExists = prevExecFields.some(
                        (field) => field.user_id === executiveId
                    );

                    if (executiveExists) {
                        return prevExecFields;
                    }

                    return [
                        ...prevExecFields,
                        { user_id: executiveId, user_percentage: isprev ? percent : "" },
                    ];
                });

                // Remove the selected user from the available users
                return prevAvailableUsers?.filter((user) => user?.user_id !== executiveId);
            }
            return prevAvailableUsers; // Return unchanged if user not found
        });
    };

    // Automatically select executive based on user role
    useEffect(() => {


        handleExecutiveSelect(
            accountInfo?.[0]?.created_by,
            100,
            true // Assuming 'true' for the initial case
        );


        // handleExecutiveSelect(
        //     userRole !== 1 ? loginUser : accountInfo?.[0]?.created_by,
        //     100,
        //     false // Assuming 'false' for the initial case
        // );

    }, [selectedService]);

    // When `executiveFields` changes, log the updated value to check the state
    useEffect(() => {
        console.log(executiveFields, "executiveFields updated");
    }, [executiveFields]);

    // Handling incentive sharing update on dependency change
    useEffect(() => {
        if (incentiveSharing.length !== 0) {
            setExecutiveFields(incentiveSharing);
        }
    }, [incentiveSharing]);




    const handlePercentageChange = useCallback(
        (index, value, flag) => {
            if (flag) {
                const newFields = executiveFields?.map((field, i) =>
                    i === index ? { ...field, user_percentage: value * 100 / 4 } : field
                );
                setExecutiveFields(newFields);
                return;
            }
            const newFields = executiveFields?.map((field, i) =>
                i === index ? { ...field, user_percentage: value } : field
            );
            setExecutiveFields(newFields);
        },
        [executiveFields]
    );

    const handleDelete = (index) => {
        const removedUser = executiveFields[index]?.user_id;
        setExecutiveFields(prevExec => prevExec?.filter((_, i) => i !== index));
        setAvailableUsers(prevAvail => [...prevAvail, userContextData?.find(user => user?.user_id === removedUser)]);
        setSelectedExecutive();
    };

    useEffect(() => {
        if (!editFlag && executiveFields?.length > 0) {
            const totalPercentage = executiveFields
                ?.slice(0, -1)
                ?.reduce((acc, field) => acc + Number(field?.user_percentage || 0), 0);
            const remainingPercentage = Math.max(0, 100 - totalPercentage);
            setExecutiveFields((prevFields) => {
                const newFields = prevFields?.map((field, index) =>
                    index === prevFields?.length - 1
                        ? { ...field, user_percentage: remainingPercentage }
                        : { ...field }
                );
                return newFields;
            });
        }
    }, [
        editFlag,
        executiveFields?.length,
        executiveFields
            ?.slice(0, -1)
            .map((field) => field?.user_percentage)
            .join(","),
    ]);

    const handleSubmit = async () => {

        const data = executiveFields.map((field) => ({
            user_id: field.user_id,
            user_percentage: Number(field.user_percentage),
        }));
        if (executiveEditFlag) {
            const updatedData = [...serviceField];

            updatedData[editIndex] = {
                service_id: selectedService,
                service_percentage: Number(serviceIncentivePercentage),
                incentive_sharing_users: executiveFields.map((field) => ({
                    user_id: field.user_id,
                    user_percentage: Number(field.user_percentage),
                })),
            };
            setServiceField(updatedData);
            setExecutiveEditFlag(false);
            setSelectedService();
            setIncentiveSharing(data);
            return;
        }

        setServiceField((prev) => [
            ...prev,
            {
                service_id: selectedService,
                service_percentage: Number(serviceIncentivePercentage),
                incentive_sharing_users: executiveFields.map((field) => ({
                    user_id: field.user_id,
                    user_percentage: Number(field.user_percentage),
                })),
            },
        ]);
        setSelectedService();
        setIncentiveSharing(data);

    };


    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-text" >{`${allSalesService?.find(data => data?._id === selectedService)?.service_name} Service Sharing`}</h5>
            </div>
            <div className="card-body row">

                <FieldContainer
                    fieldGrid={12}
                    label={"Service Sharing Percentage"}
                    type="number"
                    placeholder="Percentage"
                    value={serviceIncentivePercentage}
                    onChange={(e) => {


                        setServiceIncentivePercentage(e.target.value);
                    }}

                />

                <CustomSelect
                    fieldGrid="12"
                    label="Executives"
                    dataArray={availableUsers}
                    optionId="user_id"
                    optionLabel="user_name"
                    selectedId={selectedExecutive}
                    setSelectedId={handleExecutiveSelect}
                />

                {executiveFields.map((field, index) => (
                    <div key={index} className="col-12 row mt-3 align-items-center">
                        <div className="col-4">
                            <label className="form-label">Executive Name </label>
                            <input
                                type="text"
                                className="form-control"
                                value={userContextData?.find(
                                    (user) => user?.user_id === field?.user_id
                                )?.user_name
                                }

                            />
                        </div>
                        <div className="col-4">
                            <label className="form-label">Percentage</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Percentage"
                                value={field.user_percentage}
                                onChange={(e) =>
                                    handlePercentageChange(index, e.target.value)
                                }
                            // disabled={index === executiveFields.length - 1}
                            />
                        </div>
                        <div className="col-2">
                            <label className="form-label">value</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Percentage"
                                value={field?.user_percentage * 4 / 100}
                                onChange={(e) => {
                                    if (e.target.value <= 4)
                                        handlePercentageChange(index, e.target.value, 1)
                                }
                                }
                            // disabled={index === executiveFields.length - 1}
                            />
                        </div>
                        <div className="col-2 mt-4">
                            <button
                                title="Delete"
                                className="icon-1"
                                onClick={() => handleDelete(index)}
                            >
                                <i className="bi bi-trash" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="col-12 mt-3">
                    <button
                        className="btn cmnbtn btn-primary"
                        onClick={handleSubmit}
                        disabled={

                            // selectedService === serviceField?.find(data => data?.service_id === selectedService)?.service_id ||
                            (executiveFields.length <= 1) ||
                            executiveFields.reduce(
                                (acc, field) => acc + Number(field.user_percentage || 0),
                                0
                            ) !== 100
                        }
                    >
                        <i className="bi bi-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceIncentiveSharing