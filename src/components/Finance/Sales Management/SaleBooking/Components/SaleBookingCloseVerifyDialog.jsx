import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateSaleBookingSingleTdsVerifyMutation } from "../../../../Store/API/Finance/SaleBookingTDSApi";

const SaleBookingCloseVerifyDialog = (props) => {
  const { setVerifyDialog, verifyDialog, row, refetchSaleBookingCloseList } =
    props;

  const [
    updateSaleBookingSingleTdsVerify,
    {
      isLoading: updateSaleBookingSingleTdsVerifyLoading,
      isError: updateSaleBookingSingleTdsVerifyError,
      isSuccess: updateSaleBookingSingleTdsVerifySuccess,
    },
  ] = useUpdateSaleBookingSingleTdsVerifyMutation();
  console.log(updateSaleBookingSingleTdsVerifySuccess, "successs-----?????");

  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");

  const handleCloseVerifyDialog = () => {
    setVerifyDialog(false);
    setBalAmount("");
    setRemark("");
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tds_verified_amount: balAmount,
      tds_verified_remark: remark,
      id: row?.sale_booking_id,
    };
    await updateSaleBookingSingleTdsVerify(payload).unwrap();

    handleCloseVerifyDialog();
    toastAlert("TDS Verification Successfully Completed");
    refetchSaleBookingCloseList();
    setIsFormSubmitted(true);
  };
  return (
    <div>
      <Dialog
        open={verifyDialog}
        onClose={handleCloseVerifyDialog}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle> Verify Sale Booking </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleCloseVerifyDialog()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-md-12 ">
              <form>
                <div className="form-group col-12"></div>

                <div className="form-group">
                  <label htmlFor="images">Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="images"
                    name="images"
                    value={balAmount}
                    onChange={(e) => {
                      setBalAmount(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="images">Remark:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="images"
                    name="images"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleVerifySubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaleBookingCloseVerifyDialog;
