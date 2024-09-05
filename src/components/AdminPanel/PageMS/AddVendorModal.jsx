import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  handleChangeVendorInfoModal,
  setCloseAddVendorModal,
  setVendorRowData,
} from "../../Store/VendorMaster";
import { useDispatch, useSelector } from "react-redux";
import { DialogContent, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useAddBankNameDetailMutation,
  useAddPmsPayCycleMutation,
  useAddPmsPaymentMethodMutation,
  useAddPmsPlatformMutation,
  useAddPmsVendorTypeMutation,
  useAddVendorWhatsappLinkTypeMutation,
  useUpdateBankNameDetailMutation,
  useUpdatePmsPayCycleMutation,
  useUpdatePmsPaymentMethodMutation,
  useUpdatePmsPlatformMutation,
  useUpdateVendorTypeMutation,
  useUpdateVendorWhatsappLinkTypeMutation,
} from "../../Store/reduxBaseURL";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { useEffect, useState } from "react";

export default function AddVendorModal() {
  const { toastAlert, toastError } = useGlobalContext();
  const dispatch = useDispatch();
  const [vendorPost] = useAddPmsVendorTypeMutation();
  const [vendorUpdate] = useUpdateVendorTypeMutation();
  const [platformPost] = useAddPmsPlatformMutation();
  const [updatePlatform] = useUpdatePmsPlatformMutation();
  const [payMethodPost] = useAddPmsPaymentMethodMutation();
  const [updatePayMethod] = useUpdatePmsPaymentMethodMutation();
  const [addPayCycle] = useAddPmsPayCycleMutation();
  const [updatePayCycle] = useUpdatePmsPayCycleMutation();
  const [whatsapplinkTypePost] = useAddVendorWhatsappLinkTypeMutation();
  const [updateWhatsapplinkType] = useUpdateVendorWhatsappLinkTypeMutation();
  const [addBankName] = useAddBankNameDetailMutation();
  const [updateBankName] = useUpdateBankNameDetailMutation();
  const open = useSelector((state) => state.vendorMaster.showAddVendorModal);
  const venodrRowData = useSelector(
    (state) => state.vendorMaster.vendorRowData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const modalType = useSelector((state) => state.vendorMaster.modalType);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (venodrRowData?.type_name) {
      setValue("typeName", venodrRowData.type_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.platform_name) {
      setValue("typeName", venodrRowData.platform_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.payMethod_name) {
      setValue("typeName", venodrRowData.payMethod_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.cycle_name) {
      setValue("typeName", venodrRowData.cycle_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.link_type) {
      setValue("typeName", venodrRowData.link_type);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.bank_name) {
      setValue("typeName", venodrRowData.bank_name);
      setValue("description", venodrRowData.description);
    }
  }, [venodrRowData]);

  const handleClose = () => {
    dispatch(setCloseAddVendorModal());
    setValue("typeName", null);
    setValue("description", null);
  };

  const formSubmit = async (data) => {
    const obj = {
      type_name: data.typeName,
      description: data.description,
      created_by: userID,
    };
    if (modalType == "UpdateVendor") {
      if (venodrRowData) {
        obj.id = venodrRowData._id;
        // obj.updated_by = userID;
        obj.last_updated_by = userID;
        delete obj.updated_by;
        vendorUpdate(obj)
          .unwrap()
          .then(() => {
            toastAlert("Vendor Type Updated");
            dispatch(setVendorRowData(null));
            setValue("typeName", null);
            setValue("description", null);
            handleClose();
            dispatch(handleChangeVendorInfoModal());
          })
          .catch((err) => {
            toastError(err.message);
          });
        return;
      }
    } else if (modalType == "Vendor") {
      vendorPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Vendor Type Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
      return;
    } else if (modalType == "Platform") {
      delete obj.type_name;

      obj.platform_name = data.typeName;
      obj.description = data.description;

      platformPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Platform Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePlatform") {
      // delete obj.type_name;
      obj.id = venodrRowData._id;
      obj.last_updated_by = userID;
      delete obj.created_by;
      delete obj.type_name;
      obj.platform_name = data.typeName;
      updatePlatform(obj)
        .unwrap()
        .then(() => {
          toastAlert("Platform Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "PaymentMethod") {
      delete obj.type_name;
      obj.payMethod_name = data.typeName;
      obj.description = data.description;
      payMethodPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Method Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePayment") {
      delete obj.type_name;
      delete obj.created_by;
      obj.id = venodrRowData._id;
      obj.payMethod_name = data.typeName;
      obj.last_updated_by = userID;
      updatePayMethod(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Method Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "PayCycle") {
      delete obj.type_name;
      obj.cycle_name = data.typeName;
      obj.description = data.description;
      addPayCycle(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Cycle Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePayCycle") {
      delete obj.type_name;
      delete obj.created_by;
      obj.id = venodrRowData._id;
      obj.cycle_name = data.typeName;
      obj.last_updated_by = userID;
      updatePayCycle(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Cycle Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "WhatsappLinkType") {
      delete obj.type_name;
      obj.link_type = data.typeName;
      obj.description = data.description;
      whatsapplinkTypePost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Whatsapp Link Type Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "updateWhatsappLinkType") {
      delete obj.type_name;
      delete obj.created_by;
      obj.id = venodrRowData._id;
      obj.link_type = data.typeName;
      obj.last_updated_by = userID;
      updateWhatsapplinkType(obj)
        .unwrap()
        .then(() => {
          toastAlert("Whatsapp Link Type Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "BankName") {
      delete obj.type_name;
      delete obj.created_by;
      obj.id = venodrRowData._id;
      obj.bank_name = data.typeName;
      obj.last_updated_by = userID;
      addBankName(obj)
        .unwrap()
        .then(() => {
          toastAlert("Bank Detail Added ");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdateBankName") {
      delete obj.type_name;
      delete obj.created_by;
      obj.id = venodrRowData._id;
      obj.bank_name = data.typeName;
      obj.last_updated_by = userID;
      updateBankName(obj)
        .unwrap()
        .then(() => {
          toastAlert("Bank Detail Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
          dispatch(handleChangeVendorInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    }
  };

  useEffect(() => {
    if (modalType == "Platform") {
      setTitle("Add Platform");
    } else if (modalType == "Vendor") {
      setTitle("Add Vendor");
    } else if (modalType == "UpdateVendor") {
      setTitle("Update Vendor");
    } else if (modalType == "UpdatePlatform") {
      setTitle("Update Platform");
    } else if (modalType == "PaymentMethod") {
      setTitle("Add Payment Method");
    } else if (modalType == "UpdatePayment") {
      setTitle("Update Payment Method");
    } else if (modalType == "PayCycle") {
      setTitle("Add Payment Cycle");
    } else if (modalType == "UpdatePayCycle") {
      setTitle("Update Payment Cycle");
    } else if (modalType == "WhatsappLinkType") {
      setTitle("Add Whatsapp Link Type");
    } else if (modalType == "bankName") {
      setTitle("Add Bank Name Type");
    } else if (modalType == "updateBankName") {
      setTitle("update Bank Name Type");
    }
  }, [modalType]);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box noValidate component="form" onSubmit={handleSubmit(formSubmit)}>
            <TextField
              margin="dense"
              id="name"
              label="Type Name *"
              type="text"
              fullWidth
              {...register("typeName", {
                required: "Plese Enter the Type Name",
              })}
              helperText={errors.typeName?.message}
              error={Boolean(errors.typeName)}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
            />
            <DialogActions>
              <Button type="submit" variant="contained">
                submit
              </Button>
              <Button onClick={handleClose} variant="contained" color="error">
                Close
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
