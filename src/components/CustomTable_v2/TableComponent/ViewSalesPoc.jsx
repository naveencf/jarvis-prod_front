import React, { use, useEffect, useState } from 'react'
import FormContainer from '../../AdminPanel/FormContainer'
import View from '../../AdminPanel/Sales/Account/View/View'
import { useEditIndividualPocMutation, useGetAllPocQuery } from '../../Store/API/Sales/SalesPocApi'
import { useGetDepartmentListQuery } from '../../Store/API/Sales/DepartmentApi'
import { useGlobalContext } from '../../../Context/Context'
import { is } from 'date-fns/locale'

const ViewSalesPoc = () => {
    const { toastAlert, toastError } = useGlobalContext();
    const {
        refetch: refetchPocData,
        data: allPocData,
        isLoading,
        error,
    } = useGetAllPocQuery();
    const {
        data: departmentData,
        isLoading: departmentLoading,
        error: departmentError

    } = useGetDepartmentListQuery();

    const [
        editIndividualPoc, {
            isLoading: editPocLoading,
            error: editPocError,
            isError: isEditPocError,
        }
    ] = useEditIndividualPocMutation();
    function filterPayload(payload) {  // filter payload to remove empty values
        return Object.fromEntries(
            Object.entries(payload).filter(
                ([_, value]) => value !== undefined && value !== null && value !== ""
            )
        );
    }
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10}$/; // Adjust the regex as per your requirements
        return phoneRegex.test(phoneNumber);
    };
    async function handelEdit(row) {
        const dep_id = departmentData.find((department) => department.department_name === row.department_name)._id; // get department id from department name
        const editedrow = filterPayload({
            id: row._id,
            account_id: row.account_id,
            department: dep_id,
            contact_name: row.contact_name,
            contact_no: row.contact_no,
            email: row.email,
            alternative_contact_no: row.alternative_contact_no,
        });
        await editIndividualPoc(editedrow).unwrap();

        refetchPocData();
        toastAlert("success", "POC edited successfully");

    };
    useEffect(() => {
        if (isEditPocError) {
            toastError("error", "Failed to edit POC");
        }
    }, [])

    const columns = [
        {
            key: "s.no",
            name: "S.No",
            renderRowCell: (row, index) => index + 1,
            width: 70,
        },
        {
            key: "created_by_name",
            name: "Sales Executive",
            width: 200,
        },
        {
            key: "account_name",
            name: "Account Name",
            width: 200,
        },
        {
            key: "contact_name",
            name: "Contact Name",
            width: 200,
            editable: true,
        },
        {
            key: "department_name",
            name: "Department Name",
            customEditElement: (row, index, setEditFlag,
                editflag,
                handelchange,
                column) => {

                return <select className="form-select" value={row.department_name} onChange={e => {

                    handelchange(e, index, column)
                }} autoFocus>
                    {
                        departmentData?.map((department) => {
                            return <option value={department.department_name}>{department.department_name}</option>
                        })
                    }
                </select>
            },
            editable: true,
            width: 200,
        },
        {
            key: 'contact_no',
            name: 'Contact No.',
            customEditElement: (row, index, setEditFlag,
                editflag,
                handelchange,
                column) => {
                return <input
                    className="form-control"
                    type="number" placeholder={row[column?.key]} onChange={e => {
                        const value = e.target.value;

                        (value.length <= 10) ?
                            handelchange(e, index, column) : ""


                    }
                    } />
            },
            width: 200,
            editable: true,
        },
        {
            key: 'email',
            name: 'Email',
            width: 200,
            editable: true,
        },
        {
            key: 'alternative_contact_no',
            name: 'Alternative Contact No',
            customEditElement: (row, index, setEditFlag,
                editflag,
                handelchange,
                column) => {
                console.log(row);


                return <input
                    className="form-control"
                    type="number" placeholder={row[column?.key]} onChange={e => {
                        const value = e.target.value;
                        (value.length <= 10) ?
                            handelchange(e, index, column) : ""


                    }
                    } />
            },
            width: 200,
            editable: true,
        },
        {
            key: "actions",
            name: "Actions",
            renderRowCell: (row, index, setEditFlag,
                editflag,
                handelchange,
                column) => <div className='flex-row gap-2' >
                    <button className="icon-1" onClick={() => {
                        setEditFlag(index)
                    }}>
                        <i className="bi bi-pencil">

                        </i>
                    </button>
                    {editflag === index && <button className="icon-1"
                        onClick={() => {
                            handelEdit(row)
                            setEditFlag(false)
                        }}

                    >
                        <i className="bi bi-save">

                        </i>
                    </button>}
                </div>,
            width: 200,

        },
    ];

    return (
        <div>
            <FormContainer
                link={true}
                mainTitle={"POC Overview"}
            />

            <View
                columns={columns}
                data={allPocData}
                isLoading={isLoading}
                pagination
                title={"Sales POC"}
                tableName={"Sales POC in dashboard"}

            />

        </div>
    )
}

export default ViewSalesPoc