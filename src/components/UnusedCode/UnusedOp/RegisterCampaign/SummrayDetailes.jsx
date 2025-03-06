import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import millify from "millify";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";
import generatePDF from "../../../utils/PdfConverter";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const SummaryDetails = ({ payload, campName, generatePdf, drawer }) => {
  console.log(payload)
  const [summaryData, setSummaryData] = useState({
    total: 0,
    totalPost: 0,
    lent: 0,
    totalStory: 0,
  });
  const [catNameLengths, setCatNameLengths] = useState({});
  const [totalFollowerCount, setTotalFollowerCount] = useState(0);
  const [totalPostPerPage, setTotalPostPerPage] = useState(0);
  const [totalStoryPerPage, setStoryPerPage] = useState(0);
  const [filteredData, setFilteredData] = useState(payload);

  

  useEffect(() => {
    const updatedCatNameLengths = {};
    payload.forEach((entry) => {
      const catName = entry.cat_name;
      updatedCatNameLengths[catName] =
        (updatedCatNameLengths[catName] || 0) + 1;
    });
    setCatNameLengths(updatedCatNameLengths);
    handleSelectedRowData()

    const totalCount = payload.reduce(
      (sum, current) => sum + Number(current.follower_count),
      0
    );
    const total = formatNumber(totalCount);
    const totalPost = payload.reduce(
      (sum, current) => sum + Number(current.postPerPage),
      0
    );
    const totalStory = payload.reduce(
      (sum, current) => sum + Number(current.storyPerPage),
      0
    );
    const lent = payload.length;

    setSummaryData({ total, totalPost, lent, totalStory });
  }, [payload]);


  const handleSelectedRowData = (catName) => {
    const filteredRows = payload.filter((e) => {
      if(!catName){
        return e
      }else return e.cat_name === catName
      
    });
    setFilteredData(filteredRows);

    // const totalFollowers = filteredRows.reduce(
    //   (sum, current) => {
    //     if(typeof(current)!=Number){
    //       return sum
    //     }
    //     return sum + BigInt(current.follower_count)},
    //   0
    // );
    const totalFollowers = filteredRows.reduce(
      (sum, current) => sum + Number(current.follower_count),
      0
    );
    const totalPosts = filteredRows.reduce(
      (sum, current) => sum + Number(current.postPerPage),
      0
    );
    const totalStory = filteredRows.reduce(
      (sum, current) => sum + Number(current.storyPerPage),
      0
    );

    setTotalFollowerCount(formatNumber(totalFollowers));
    setTotalPostPerPage(formatNumber(totalPosts));
    setStoryPerPage(formatNumber(totalStory));
  };

  console.log(totalPostPerPage)
  const formatNumber = (value) => {

    console.log(value)
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}k`;
    } else if (value >= 10000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else {
      return value.toString();
    }
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = payload.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    {
      field: "page_name",
      headerName: "Pages",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: 150,
      editable: true,
    },
    {
      field: "storyPerPage",
      headerName: "Story / Page",
      width: 150,
      editable: true,
    },
  ];

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const catNames = Object.keys(catNameLengths);

    const catNameCounts = catNames.reduce((counts, catName) => {
      counts[catName] = payload.filter(item => item.cat_name === catName).length;
      return counts;
    }, {});

    const overviewData = [
        ["", "", "Proposal"],
        ["Sno.", "Description", "Platform", "Count", "Deliverables", "Cost"],
    ];

    catNames.forEach((catName, index) => {
        overviewData.push([index + 1, catName, "Instagram", catNameCounts[catName] || 0, "", ""]);
    });

    overviewData.push(
        ["", "", "GST (18%)", "",""],
        ["", "Total", "", summaryData.lent]
    );

    const overviewWorksheet = XLSX.utils.aoa_to_sheet(overviewData);

    overviewWorksheet["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, overviewWorksheet, "Overview");
    Object.keys(catNameLengths).forEach((catName) => {
      const catData = payload
        .filter((item) => item.cat_name === catName)
        .map((item, index) => ({
          sno: index + 1,
          Page: item.page_name,
          Link: {
            t: "s",
            v: item.page_link,
            l: {
              Target: item.page_link,

              Tooltip: "Click to open link",
            },
          },
          Followers: item.follower_count,
          "Post ": item.postPerPage,
          "Story ": item.storyPerPage,
        }));

      const catWorksheet = XLSX.utils.json_to_sheet(catData);
      catWorksheet["!cols"] = [
        { wch: 10 },
        { wch: 20 },
        { wch: 40 },
        { wch: 15 },
        { wch: 8 },
        { wch: 8 },
      ];

      XLSX.utils.book_append_sheet(workbook, catWorksheet, catName);
    });
    XLSX.writeFile(workbook, `${campName}.xlsx`);
  };



  return (
    <>
      {payload?.length > 0 && (
        <Box sx={{ height: `${drawer === true ?"100%":"700px"}`, width:`${drawer === true ? "100%":"40%"}`,border:"1px solid var(--gray-200)",overflow:"hidden",borderRadius:"12px" }}>
          <Paper elevation={1} sx={{ mb: 1, height: "130px", width: "100%" ,background:"var(--body-bg)"}}>
            <h5
              
              style={{ textAlign: "center", padding: "10px" ,color:"var(--gray-700)"}}
            >
              Summary
            </h5>
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                mt: 2,
                background:"var(--white)",
                color:"var(--gray-500)",
              }}
            >
              <Typography variant="6"> Pages: {summaryData.lent}</Typography>
              <Typography variant="6">
                Followers: {summaryData.total}
              </Typography>
              <Typography variant="6">
                Posts: {summaryData.totalPost || 0}
              </Typography>
              <Typography variant="6">
                Story: {summaryData.totalStory || 0}
              </Typography>
            </Box>
            <Box className="sb gap4 pb-2">
              <div className="pack" style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
              

              <button
                onClick={downloadExcel}
                variant="text"
                color="success"
                title="Download Excel"
                className="btn btn-outline-success icon-1 p-1 "
                >
                <SiMicrosoftexcel />
              </button>
              <button
            onClick={() => generatePDF(filteredData)}
            variant="text"
            color="error"
            title="Download Pdf"
            className="btn btn-outline-danger icon-1 p-1 "
            
            >
            <PictureAsPdfIcon />
          </button>
            </div>
              {/* <Button
                onMouseEnter={downloadExcel} 
                variant="contained"
                color="primary"
              >
                Excel
              </Button> */}
            </Box>
          </Paper>

          <Box>
            <div className="summaryDetailingwebkit mb-2">
              <ul
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  // marginBottom: "20px",
                }}
              >
                {Object.entries(catNameLengths).map(([catName, count]) => (
                  <Box key={catName} sx={{ ml: 2 }}>
                    <Button
                      onClick={() => handleSelectedRowData(catName)}
                      variant="outlined"
                      color="secondary"
                    >
                      {catName} : {count}
                    </Button>
                  </Box>
                ))}
              </ul>
            </div>
          </Box>

          <Box className="mb-2"  sx={{display:"flex",justifyContent:"space-between",padding:"5px",background:"var(--body-bg)"}}>
            <div sx={{ fontSize:"14px"}}style={{color:"var(--gray-500)"}}>Followers: {totalFollowerCount}</div>
            <div sx={{ fontSize:"14px"}}style={{color:"var(--gray-500)"}}>Posts: {totalPostPerPage}</div>
            <div sx={{ fontSize:"14px"}}style={{color:"var(--gray-500)"}}>Stories: {totalStoryPerPage}</div>
          </Box>
          <DataGrid
            rows={filteredData ? filteredData : payload}
            columns={columns}
            getRowId={(row) => row.p_id}
            pageSizeOptions={[5]}
          />
        </Box>
      )}
    </>
  );
};

export default SummaryDetails;
