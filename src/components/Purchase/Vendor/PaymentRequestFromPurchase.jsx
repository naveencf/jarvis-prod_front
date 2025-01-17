import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";

const PaymentRequestFromPurchase = ({ reqestPaymentDialog, setReqestPaymentDialog }) => {
    const [formData, setFormData] = useState({
        vendorName: "salman yusuf patel",
        address: "",
        mobile: "8691950760",
        pan: "",
        gst: false,
        outstanding: "₹4,000",
        requestAmount: "",
        gstAmount: "",
        priority: "",
        invoiceNo: "",
        invoiceDate: "",
        invoiceRemark: "",
        invoiceProof: null,
        remark: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, invoiceProof: e.target.files[0] });
    };

    const handleSubmit = () => {
        console.log("Form Data Submitted: ", formData);
        setReqestPaymentDialog(false); // Close the dialog after submission
    };

    return (
        <Dialog
            open={reqestPaymentDialog}
            onClose={() => setReqestPaymentDialog(false)}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Request Payment</DialogTitle>
            <DialogContent>
                <div style={{ display: "grid", gap: "16px", marginBottom: "16px" }}>
                    <TextField
                        label="Vendor Name"
                        value={formData.vendorName}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Mobile"
                        value={formData.mobile}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                    <TextField
                        label="PAN"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Outstanding"
                        value={formData.outstanding}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.gst}
                                onChange={(e) =>
                                    setFormData({ ...formData, gst: e.target.checked })
                                }
                            />
                        }
                        label="Add GST (18%)"
                    />
                    <TextField
                        label="Request Amount (With GST)"
                        name="requestAmount"
                        value={formData.requestAmount}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="GST Amount"
                        name="gstAmount"
                        value={formData.gstAmount}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                    <TextField
                        label="Invoice No#"
                        name="invoiceNo"
                        value={formData.invoiceNo}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        type="date"
                        label="Invoice Date"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Invoice No#</TableCell>
                                <TableCell>Invoice Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>12345</TableCell>
                                <TableCell>2025-01-10</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>2</TableCell>
                                <TableCell>67890</TableCell>
                                <TableCell>2025-01-12</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <TextField
                        label="Invoice Remark"
                        name="invoiceRemark"
                        value={formData.invoiceRemark}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Invoice Proof / Screenshot
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    <TextField
                        label="Remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        fullWidth
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setReqestPaymentDialog(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Request Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentRequestFromPurchase;
