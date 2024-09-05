import html2pdf from "html2pdf.js";

const dynamicPDFDownload = (data) => {
  console.log(data, "allUserData");

  var opt = {
    margin: 1,
    filename: `${data[0].user_name}_incentive.pdf`, // Assuming user_name is present in the first object of the data array
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const tableRows = data.map((row, index) => ({
    "S.No": index + 1,
    "Service Name": row.Sales_Service_Master.service_name,
    "Incentive Type": row.incentive_type,
    Value: row.value,
  }));

  const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px;">S.No</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Service Name</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Incentive Type</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows
              .map(
                (row) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${row["S.No"]}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${row["Service Name"]}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${row["Incentive Type"]}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${row["Value"]}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

  // Render the HTML content using html2pdf
  html2pdf().from(htmlContent).set(opt).save();
};

export default dynamicPDFDownload;
