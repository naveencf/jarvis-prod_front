import React, { useEffect, useState } from 'react'
import FormContainer from '../../FormContainer'
import axios from 'axios'
import View from '../Account/View/View'
import { baseUrl } from '../../../../utils/config'
import getDecodedToken from '../../../../utils/DecodedToken'

const IncentiveSettlement = () => {

    const [settlementData, setSettlementData] = useState([])
    const token = getDecodedToken();
    let loginUserId;
    const loginUserRole = token.role_id;
    if (loginUserRole !== 1) {
        loginUserId = token.id;
    } const [loading, setLoading] = useState(false)

    async function fetchData() {
        setLoading(true);
        try {
            let response;

            response = await axios.get(baseUrl + `sales/incentive_settlement_dashboard${loginUserId ? "?userId=" + loginUserId : ""}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            }
            )

            setSettlementData(response.data.data);
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
        width: 50,
        renderRowCell: (row, index) => {
            return index + 1
        }
    }, {
        key: "user_name",
        name: "User Name",
        width: 150,


    }, {
        key: "totalDocuments",
        name: "Total Documents",
        width: 150,

    }, {
        key: "recordServiceAmount",
        name: "Record Service Amount",
        width: 150,
    }, {
        key: "gstRecordServiceAmount",
        name: "GST Record Service Amount",
        width: 150,

    }, {
        key: "nonGstRecordServiceAmount",
        name: "Non GST Record Service Amount",
        width: 150,
    }, {
        key: "incentiveAmount",
        name: "Incentive Amount",
        width: 150,
    }]

    return (
        <div>
            <FormContainer
                link={true}
                mainTitle={"Incentive Settlement"}
            />
            <View
                title={"Incentive Settlement Overview"}
                data={settlementData}
                loading={loading}
                columns={columns}
                pagination
                tableName={"IncentiveSettlementoverview"}
            />

        </div>
    )
}

export default IncentiveSettlement