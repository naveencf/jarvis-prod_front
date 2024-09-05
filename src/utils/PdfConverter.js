import { jsPDF } from "jspdf";
import "jspdf-autotable";

const generatePDF = (pages) => {
  const doc = new jsPDF();

  const totalFollowerCount = pages.reduce(
    (sum, page) => sum + parseInt(page.follower_count || 0),
    0
  );
  const totalPages = pages.length;
  const totalPost = pages.reduce(
    (sum, page) => sum + parseInt(page.postPerPage || 0),
    0
  );
  const totalStory = pages.reduce(
    (sum, page) => sum + parseInt(page.storyPerPage || 0),
    0
  );

  const tableColumn = [
    "Page Name",
    "Follower Count",
    "Category",
    "Posts/Page",
    "Stories/Page",
  ];
  const tableRows = [];

  pages.forEach((page) => {
    const pageData = [
      page.page_name,
      page.follower_count,
      page.cat_name,
      page.postPerPage || "N/A",
      page.storyPerPage || "N/A",
    ];
    tableRows.push(pageData);
  });

  // Styling for the text elements
  doc.setFont("helvetica");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Set text color to black

  // Add total counts in one line with styling
  doc.text(
    `Total Follower: ${totalFollowerCount} | Total Pages: ${totalPages} | Total Post: ${totalPost} | Total Story: ${totalStory}`,
    10,
    10
  );

  doc.autoTable({
    startY: 30, // Adjust the starting position for the table
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`page_details_report_${new Date().getTime()}.pdf`);
};

export default generatePDF;
