import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import Loader from "../Loader/Loader";
import {baseUrl} from '../../../../utils/config'

const NewPages = ({ pages }) => {
  const navigate = useNavigate();
  const [camp, setCamp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCampaignData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`exe_campaign`
      );
      setCamp(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCampaignData();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  if (isLoading) {
    return <Loader message="Manager DashBoard..." />;
  }

  const handleVerification = (param) => {
    navigate(`/admin/manager-dashboard/${param.row._id}`);
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = pages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exeCmpId",
      headerName: "Campaign Name",
      width: 170,
      renderCell: (params) => {
        return camp?.filter((e) => {
          return e.exeCmpId == params.row.exeCmpId;
        })[0]?.exeCmpName;
      },
    },
    //   {
    //     field: "brand_id",
    //     headerName: "Brand Name",
    //     width: 150,
    //     renderCell: (params) => {
    //       return brandName.filter((e) => {
    //         return e.brand_id == params.row.brand_id;
    //       })[0]?.brand_name;
    //     },
    //   },

    {
      field: "detailing",
      headerName: "Detailing",
      width: 180,
    },
    {
      field: "brnad_dt",
      headerName: "Date",
      width: 180,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt).toLocaleDateString();
      }
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button
              onClick={() => handleVerification(params)}
             className="icon-1"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={pages}
        columns={columns}
        getRowId={(row) => row.register_campaign_id}
        pagination
        pageSize={5}
      />
    </>
  );
};

export default NewPages;
