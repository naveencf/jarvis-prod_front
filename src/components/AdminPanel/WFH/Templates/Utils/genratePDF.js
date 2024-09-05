import html2pdf from "html2pdf.js";

export const generatePDF = async (rowData, ref) => {
  if (!ref.current) {
    console.error("Reference to the element is missing");
    return;
  }

  const options = {
    margin: 10,
    filename: `${rowData.user_name}_${rowData.month}_invoice.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: true, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().from(ref.current).set(options).save();
};
