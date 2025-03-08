import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import CampaignDetails from "./CampaignDetails";
import * as XLSX from "xlsx";
import { baseUrl } from "../../../utils/config";
import SummaryDetails from "./SummrayDetailes";
import formatString from "./CampaignMaster/WordCapital";

const TempPlanCreation = () => {
  const location = useLocation();
  const saleBookingId = location.state?.sale_id;
  const navigate = useNavigate();
  const { id } = useParams();
  const [postData, setPostData] = useState({});
  const [pageData, setPageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [payload, setPayload] = useState([]);

  const handleChange = (event, rowIndex) => {
    const { name, value } = event.target;
    setPostData((prevData) => ({
      ...prevData,
      [rowIndex]: {
        ...prevData[rowIndex],
        [name]: value,
      },
    }));
  };

  const getPageData = async () => {
    try {
      const Fdata = await axios.get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
      );
      setPageData(Fdata.data.body);
      setFilteredData(Fdata.data.body);
      const res = await axios.get(
        `${baseUrl}get_single_sale_booking_data_new_table/${saleBookingId}`
      );
      console.log(res);
      const urlData = await axios.post(
        baseUrl + `get_excel_data_in_json_from_url`,
        {
          excelUrl: res.data.data?.excelUrl,
        }
      );
      const filteredDataU = urlData.data.filter((item) => item.Sno !== "");
      const normalizeString = (str) => {
        return str
          ? str
            .trim()
            .toLowerCase()
            .replace(/\u200B/g, "")
          : "";
      };
      const matchedDataWithPId = filteredDataU.map((itemU) => {
        const normalizedName = normalizeString(itemU.Name);
        const matchedPage = Fdata.data.body.find((item) => {
          return normalizedName === normalizeString(item.page_name);
        });
        if (matchedPage) {
          return {
            Sno: itemU.Sno,
            page_name: itemU.Name,
            page_link: itemU.Link,
            follower_count: itemU["Follower Count"],
            PostCount: itemU["Post Count"],
            p_id: matchedPage.p_id,
            cat_name: matchedPage.cat_name,
          };
        } else {
          return {
            Sno: itemU.Sno,
            page_name: itemU.Name,
            page_link: itemU.Link,
            follower_count: itemU["Follower Count"],
            PostCount: itemU["Post Count"],
          };
        }
      });
      const filteredMatchedData = matchedDataWithPId.filter(
        (item) => item.page_name !== "Poetsgram"
      );
      setFilteredData(filteredMatchedData);
    } catch (error) {
      console.error("Error fetching page data", error);
    }
  };

  useEffect(() => {
    getPageData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const secondSheetName = workbook.SheetNames[1];
          const worksheet = workbook.Sheets[secondSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const uploadedPageNames = jsonData
            .slice(1)
            .map((row) => row[1])
            .filter((name) => name)
            .map((name) => name.trim().toLowerCase());
          const matchedData = filterData(uploadedPageNames);
          setFilteredData(matchedData);
        } catch (error) {
          console.error("Error reading or parsing file", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const filterData = (uploadedPageNames) => {
    return pageData.filter((item) =>
      uploadedPageNames.includes(item.page_name.trim().toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedPages = filteredData.filter((row) =>
        selectedRows.includes(row.p_id)
      );
      const pages = selectedPages.map((page, index) => ({
        p_id: page.p_id,
        page_name: page.page_name,
        page_link: page.page_link,
        cat_name: page.cat_name,
        follower_count: page.follower_count,
        postPerPage: postData[index]?.posts_per_page || 1,
        storyPerPage: postData[index]?.story_per_page || 1,
      }));

      const postResult = await axios.post(`${baseUrl}opcampaignplan`, {
        campaignId: id,
        campaignName: "Test Campaign",
        planName: "Test Plan",
        pages: pages,
      });

      navigate("/admin/op-registered-campaign");
    } catch (error) {
      console.error("Error posting data", error);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 10,
    },
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = filteredData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        const formattedPageName = formatString(params.row.page_name);

        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {formattedPageName}
              </a>
            )}
          </div>
        );
      },
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 250,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
    },
    {
      field: "posts_per_page",
      headerName: "Posts",
      width: 140,
      renderCell: (params) => (
        <input
          type="number"
          name="posts_per_page"
          className="form-control border border-primary"
          value={postData[params.rowIndex]?.posts_per_page || 1}
          onChange={(event) => handleChange(event, params.rowIndex)}
        />
      ),
    },
    {
      field: "story_per_page",
      headerName: "Story ",
      width: 140,
      renderCell: (params) => (
        <input
          type="number"
          name="story_per_page"
          className="form-control border border-primary"
          value={postData[params.rowIndex]?.story_per_page || 1}
          onChange={(event) => handleChange(event, params.rowIndex)}
        />
      ),
    },
  ];
  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
    const selectedData = filteredData.filter((row) =>
      selectedIds.includes(row.p_id)
    );
    setPayload(selectedData);
  };
  return (
    <>
      <FormContainer mainTitle="Plan Creation" link="true" />
      <CampaignDetails cid={id} />
      <div>
        <label> Upload Excel</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="form-control w-auto"
          onChange={handleFileUpload}
        />
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 0.5,
            height: "700px",
            width: `${selectedRows.length > 0 && "100%"}`,
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.p_id}
            checkboxSelection
            pagination
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows?.map((row) => row)}
          />
          <SummaryDetails
            payload={payload}
            campName={"CampaignExcel"}
            drawer={false}
          />
        </div>
      </div>
      <button
        className="btn btn-outline-danger rounded-pill"
        onClick={handleSubmit}
        style={{ width: "10%" }}
      >
        Submit
      </button>
    </>
  );
};
export default TempPlanCreation;
