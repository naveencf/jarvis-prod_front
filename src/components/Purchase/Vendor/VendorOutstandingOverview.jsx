import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import View from "../../AdminPanel/Sales/Account/View/View";
import axios from "axios";
import PaymentRequestFromPurchase from "./PaymentRequestfromPurchase";


const VendorOutstandingOverview = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State for the search input and table data
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get("vendor_name") || "");
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [reqestPaymentDialog, setReqestPaymentDialog] = useState(false);

    useEffect(() => {
        // Fetch data whenever the search term changes
        const fetchData = async () => {
            const query = new URLSearchParams(location.search).get("vendor_name") || "";
            setIsLoading(true);

            try {
                // Replace with your API endpoint
                const response = await axios.get("/api/vendors", {
                    params: { vendor_name: query },
                });

                setFilteredData(response.data || []); // Assuming response data is the array of rows
            } catch (error) {
                console.error("Error fetching vendor data:", error);
                setFilteredData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Update the query parameter in the URL
        const params = new URLSearchParams(location.search);
        if (value) {
            params.set("vendor_name", value);
        } else {
            params.delete("vendor_name");
        }
        navigate(`?${params.toString()}`);
    };

    const columns = [
        {
            key: "sno",
            name: "S.NO",
            width: 80,
            renderRowCell: (row, index) => {
                return index + 1;
            },
        },
        {
            key: "vendor_name",
            name: "Vendor Name",
            width: 200,
        },
        // Add more columns as needed
    ];

    return (
        <>
            {reqestPaymentDialog && <PaymentRequestFromPurchase reqestPaymentDialog={reqestPaymentDialog} setReqestPaymentDialog={setReqestPaymentDialog} />}
            <div className="card">


                <View
                    version={1}
                    columns={columns}
                    data={filteredData}
                    isLoading={isLoading}
                    title="Vendor Overview"
                    rowSelectable={true}
                    pagination={[100, 200, 1000]}
                    tableName="Vendor Overview"
                    addHtml={
                        <>
                            <TextField
                                label="Search Vendor"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button variant="contained" onClick={() => setReqestPaymentDialog(!reqestPaymentDialog)}>
                                Open Payment Form
                            </Button>
                        </>
                    }
                />
            </div>
        </>
    );
};

export default VendorOutstandingOverview;
