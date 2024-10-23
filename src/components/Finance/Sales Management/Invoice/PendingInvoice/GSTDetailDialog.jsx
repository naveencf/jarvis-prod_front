// import { Dialog, DialogTitle } from "@mui/material";
// import React from "react";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { useEffect } from "react";

// const GSTDetailDialog = () => {
//   const handleGSTNumberClick = async (data) => {
//     const gstNumber = data?.document_no?.trim();

//     const flag1Payload = {
//       flag: 1,
//       gstNo: gstNumber,
//     };

//     const flag2Payload = {
//       flag: 2,
//       gstNo: gstNumber,
//     };

//     try {
//       const flag1Response = await axios.post(
//         `https://insights.ist:8080/api/v1/get_gst_details`,
//         flag1Payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${gstApiToken}`,
//           },
//         }
//       );
//       const flag1ResponseData = flag1Response?.data?.data;

//       if (flag1ResponseData) {
//         const gstArray = [
//           {
//             trade_name: flag1ResponseData?.trade_name,
//             legal_business_name: flag1ResponseData?.legal_business_name,
//             constitution_of_business:
//               flag1ResponseData?.constitution_of_business,
//             principal_place_of_business:
//               flag1ResponseData?.principal_place_of_business,
//             gstin: flag1ResponseData?.gstin,
//           },
//         ];
//         setGSTNumClick(gstArray);
//         toastAlert("GST Detail Processed Sucessfully");
//       } else {
//         toastError("Failed to fetch GST details");
//       }
//     } catch (error) {
//       try {
//         const flag2Response = await axios.post(
//           `https://insights.ist:8080/api/v1/get_gst_details`,
//           flag2Payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${gstApiToken}`,
//             },
//           }
//         );

//         const flag2ResponseData =
//           flag2Response?.data?.data?.enrichment_details?.online_provider
//             ?.details;

//         if (flag2ResponseData) {
//           const gstArray = [
//             {
//               trade_name: flag2ResponseData.trade_name?.value || "",
//               legal_business_name: flag2ResponseData.legal_name?.value || "",
//               constitution_of_business:
//                 flag2ResponseData.constitution?.value || "",
//               principal_place_of_business:
//                 // flag2ResponseData.primary_address?.value ||
//                 "",
//               gstin: flag2ResponseData.gstin?.value || "",
//             },
//           ];
//           setGSTNumClick(gstArray);
//           toastAlert(
//             "GST details processed successfully, but this API could not provide the address"
//           );
//         } else {
//           toastAlert("Failed to fetch GST details");
//         }
//       } catch (flag2Error) {
//         toastAlert("Failed to fetch both the GST details api");
//       }
//     }
//   };

//   useEffect(() => {
//     handleGSTNumberClick();
//   }, []);

//   return (
//     <div>
//       <Dialog
//         open={bankDetail}
//         onClose={handleCloseBankDetail}
//         fullWidth={"md"}
//         maxWidth={"md"}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <DialogTitle>Bank Details</DialogTitle>
//         <IconButton
//           aria-label="close"
//           onClick={handleCloseBankDetail}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//         {gstNumClick?.map((data) => (
//           <section id="DetailView">
//             <div className="cardAccordion">
//               <Accordion>
//                 <AccordionSummary
//                   expandIcon={<ExpandMoreIcon />}
//                   aria-controls="panel1-content"
//                   id="panel1-header"
//                 >
//                   GST Number Details
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <div className="row">
//                     <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
//                       <div className="card saleAccDetailCard">
//                         <div className="card-header">
//                           <h4 className="card-title">GST Details</h4>
//                         </div>
//                         <div className="card-body">
//                           <ul className="saleAccDetailInfo">
//                             <li>
//                               <span> Trade Name</span>
//                               {data?.trade_name || "N/A"}
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
//                       <div className="card saleAccDetailCard">
//                         <div className="card-header">
//                           <h4 className="card-title">Business Details</h4>
//                         </div>
//                         <div className="card-body">
//                           <ul className="saleAccDetailInfo">
//                             <li>
//                               <span> Legal Business Name</span>
//                               {data?.legal_business_name || "N/A"}
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
//                       <div className="card saleAccDetailCard">
//                         <div className="card-header">
//                           <h4 className="card-title">
//                             {" "}
//                             Constitution OF Business
//                           </h4>
//                         </div>
//                         <div className="card-body">
//                           <ul className="saleAccDetailInfo">
//                             <li>
//                               <span>Constitution OF Business:</span>
//                               {data?.constitution_of_business || "N/A"}
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     {/* )} */}
//                   </div>
//                   <div className="row">
//                     <div className="col-xl-12 col-lg-12 col-md-12 col-sm-24 col-24">
//                       <div className="card saleAccDetailCard">
//                         <div className="card-header">
//                           <h4 className="card-title">Address</h4>
//                         </div>
//                         <div className="card-body">
//                           <ul className="saleAccDetailInfo">
//                             <li>
//                               <span>Address:</span>
//                               {data?.principal_place_of_business || "N/A"}
//                             </li>
//                             <li>
//                               <span>GST In:</span>
//                               {data?.gstin || "N/A"}
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionDetails>
//               </Accordion>
//             </div>
//           </section>
//         ))}
//       </Dialog>
//     </div>
//   );
// };

// export default GSTDetailDialog;
