import React from "react";
import { useGetAllSaleBookingQuery } from "../../../Store/API/Sales/SaleBookingApi";
import jwtDecode from "jwt-decode";
import View from "../Account/View/View";
import { useGetStatementQuery } from "../../../Store/API/Sales/IncentiveSettelmentApi";

const StatementSheet = () => {
    const token = sessionStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : {};
    const loginUserId = decodedToken.id;

    const {
        data: allSaleBooking = [],
        refetch: refetchSaleBooking,
        error: allSaleBookingError,
        isLoading: allSaleBookingLoading,
    } = useGetAllSaleBookingQuery({ loginUserId }, { skip: !loginUserId });

    const {
        data: statementData = [],
        error: statementError,
        isLoading: statementLoading,
    } = useGetStatementQuery(loginUserId, { skip: !loginUserId });

    const mergedData = [
        ...allSaleBooking
            .filter((ob) => ob?.incentive_earning_status === "earned")
            .map((item) => ({
                date: new Date(item?.incentive_earned_date).toLocaleDateString(),
                description: "Earned Incentive",
                debit: 0,
                credit: item?.earned_incentive_amount || 0,
            })),

        ...statementData
            .filter((ob) => ob?.finance_status === "approved")
            .map((item) => ({
                date: new Date(item.payment_date).toLocaleDateString(),
                description: "Incentive Released",
                debit: item?.finance_released_amount || 0,
                credit: 0,
            })),
    ];
    // Sort the mergedData based on the date
    mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const totalDebit = mergedData.reduce((acc, curr) => acc + (curr?.debit || 0), 0);
    const totalCredit = mergedData.reduce((acc, curr) => acc + (curr?.credit || 0), 0);
    const balance = totalCredit - totalDebit;

    const columns = [
        {
            key: "serial_no",
            name: "S.NO",
            renderRowCell: (row, index) => index + 1,
            width: 50,
        },
        { key: "date", name: "Date", width: 100 },
        { key: "description", name: "Description", width: 200 },
        { key: "debit", name: "Debit", width: 100, getTotal: true },
        { key: "credit", name: "Credit", width: 100, getTotal: true },
    ];

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="card shadow-none bgSecondaryLight">
                        <div className="card-body text-center pb-2">
                            <h6 className="fs-16">Credit Balance: {totalCredit.toFixed(2)}</h6>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card shadow-none bgTertiaryLight">
                        <div className="card-body text-center pb-2">
                            <h6 className="fs-16">Debit Balance: {totalDebit.toFixed(2)}</h6>
                        </div>
                    </div>
                </div>

                <div className="col">
                    <div className="card shadow-none bgSuccessLight">
                        <div className="card-body text-center pb-2">
                            <h6 className="fs-16">Balance: {balance.toFixed(2)}</h6>
                        </div>
                    </div>
                </div>
            </div>

            <View
                version={1}
                columns={columns}
                data={mergedData}
                title={"Balance Sheet"}
                pagination={[100, 200]}
                tableName={"BalanceSheet"}
                showTotal={true}
            />
        </div>
    );
};

export default StatementSheet;
