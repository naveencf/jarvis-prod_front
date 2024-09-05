import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { baseUrl } from '../../../../utils/config';
import FormContainer from '../../FormContainer';
import View from '../Account/View/View';
import DateISOtoNormal from '../../../../utils/DateISOtoNormal';

const IncentiveRequest = () => {
    const userData = useLocation().state;
    const [incentiveData, setIncentiveData] = useState([]);
    const [loading, setLoading] = useState(false);
    async function fetchData() {
        setLoading(true);
        try {
            let response;

            response = await axios.get(baseUrl + `sales/incentive_request_user_status_wise/${userData.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
            )

            setIncentiveData(response.data.data[0].incentiveRequestList);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    const columns = [{
        key: "S.No",
        name: "S.No",
        width: "50",
        renderRowCell: (row, index) => {
            return index + 1
        },

    },
    {
        key: "sales_executive_name",
        name: "Sales Executive Name",
        width: "150",
    },


    {
        key: "admin_approved_amount",
        name: "Admin Approved Amount",
        width: "150"

    },
    {
        key: "admin_status",
        name: "Admin Status",
        width: "150",
    },
    {
        key: "finance_released_amount",
        name: "Finance Released Amount",
        width: "150"
    }, {
        key: "user_requested_amount",
        name: "User Requested Amount",
        width: "150",
    }, {
        key: "createdAt",
        name: "Requested Date",
        renderRowCell: (row) => (
            <div>
                {DateISOtoNormal(row.createdAt)}
            </div>
        ),
        width: "150"
    }
    ]
    if (userData.type === "released") {
        columns.push({
            key: "payment_date",
            name: "Payment Date",
            renderRowCell: (row) => (
                <div>
                    {DateISOtoNormal(row.payment_date)}
                </div>
            ),
            width: "150",
        },

            {
                key: "payment_ref_no",
                name: "Payment Ref No",
                width: "150"
            })
    }
    else {
        columns.push({
            key: "balanceReleaseAmount",
            name: "Balance Release Amount",
            width: "150"
        })
    }

    return (
        <div>
            <FormContainer
                link={true}
                mainTitle={userData.type === "released" ? "Incentive Request" : "Incentive Release"}
            />
            <View
                columns={columns}
                data={incentiveData}
                isLoading={loading}
                pagination
                title={userData.type === "released" ? "Incentive Request Overview" : "Incentive Release Overview"}
                tableName={userData.type === "released" ? "sales_incentive_request_Dashboard" : "sales_incentive_released_Dashboard"}
            />
        </div>
    )
}

export default IncentiveRequest




