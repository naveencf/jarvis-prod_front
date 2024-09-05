import axios from "axios";
import { useEffect } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import OndemandVideoTwoToneIcon from "@mui/icons-material/OndemandVideoTwoTone";
import DeleteHistoryConfirmation from "./DeleteHistoryConfirmation";
import ContentLoader from "react-content-loader";
import { baseUrl } from "../../utils/config";

export default function StatsAllPagesDetail() {
  const [allPagesDetail, setAllPagesDetail] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [phpData, setPhpData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [openDeleteHistoryConFirmation, setOpenDeleteHistoryConFirmation] =
    useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [loading, setLoading] = useState(false);
  const apiCall = () => {
    axios
      .get(baseUrl + "get_distinct_count_history")
      .then((res) => {
        console.log(res.data);
        setAllPagesDetail(res.data.data);
      });
  };

  useEffect(() => {
    const formData = new URLSearchParams();
    formData.append("loggedin_user_id", 36);
    setLoading(true);
    axios
      .get(baseUrl + "get_all_purchase_data")
      .then((res) => {
        setLoading(false);
        setPhpData(res.data.result);
        let tempdata = res.data.result.filter((ele) => {
          return ele.platform.toLowerCase() == "instagram";
        });
      });
    apiCall();
    axios.get(baseUrl + "get_all_users").then((res) => {
      setAllUsers(res.data.data);
    });
  }, []);

  const handleClickOpenDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(true);
  };

  const handleDeleteRowData = (data) => {
    setRowData(data);
    handleClickOpenDeleteHistoryConFirmation();
  };

  const handleCloseDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(false);
  };

  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }
  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      renderCell: (params) => {
        const rowIndex = allPagesDetail.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "platform",
      headerName: "Platform",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.p_id ? (
              <>
                {phpData.filter((e) => e.p_id == params.row.p_id)[0]?.platform}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.p_id ? (
              <>
                {phpData.filter((e) => e.p_id == params.row.p_id)[0]?.page_name}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "followers",
      headerName: "Followers Count",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.p_id ? (
              <>
                {
                  phpData.filter((e) => e.p_id == params.row.p_id)[0]
                    ?.follower_count
                }
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "acc_cat",
      headerName: "Account Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.p_id ? (
              <>
                {
                  phpData?.filter((e) => e.p_id == params?.row.p_id)[0]
                    ?.cat_name
                }
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "Update percentage",
      width: 150,
      headerName: "Stats Update %",
      renderCell: (params) => {
        return (
          Math.round(
            +phpData?.filter((e) => e.p_id == params?.row.p_id)[0]
              ?.totalPercentage
          ) + "%"
        );
      },
    },
    {
      field: "creation_date",
      headerName: "Creation Date",
      readerCell: (params) => {
        return (
          <div>
            {params.row?.creation_date ? (
              <>
                {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "executive_name",
      headerName: "Executive Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.user_id ? (
              <>
                {
                  allUsers.filter((e) => e.user_id == params.row.user_id)[0]
                    ?.user_name
                }
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "reach",
      headerName: "Reach",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.reach ? (
              <>
                {params.row.reach} {params.row.percentage_reach}&nbsp;
                {params.row.reach_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.reach_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "impression",
      headerName: "Impression",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.impression ? (
              <>
                {params.row.impression} {params.row.percentage_impression}
                &nbsp;
                {params.row.impression_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.impression_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.engagement ? (
              <>
                {params.row.engagement} {params.row.percentage_engagement}
                &nbsp;
                {params.row.engagement_upload_image_url && (
                  <a
                    key="engagement"
                    href={params.row.engagement_upload_image_url}
                    title="Engagement Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "story_view",
      headerName: "Story View",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view ? (
              <>
                {params.row.story_view} {params.row.percentage_story_view}
                &nbsp;
                {params.row.story_view_upload_image_url && (
                  <a
                    key="storyImg"
                    href={params.row.story_view_upload_image_url}
                    title="Story View Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
                {params.row.story_view_upload_video_url && (
                  <a
                    key="storyVdo"
                    href={params.row.story_view_upload_video_url}
                    title="Story view Video"
                    download
                  >
                    <OndemandVideoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "stats_for",
      headerName: "Stats For",
      width: 150,
    },
    {
      field: "quater",
      headerName: "Quater",
      width: 150,
    },
    {
      field: "city1_name",
      headerName: "City 1",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city1_name ? (
              <>
                {params.row.city1_name} &nbsp;{" "}
                {params.row.percentage_city1_name}%
                {params.row.city_image_upload_url && (
                  <a
                    key="cityImg"
                    href={params.row.city_image_upload_url}
                    title="City Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city2_name",
      headerName: "City 2",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city2_name ? (
              <>
                {params.row.city2_name} &nbsp;{" "}
                {params.row.percentage_city2_name}%
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city3_name",
      headerName: "City 3",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city3_name ? (
              <>
                {params.row.city3_name} &nbsp;{" "}
                {params.row.percentage_city3_name}%
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city4_name",
      headerName: "City 4",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city4_name ? (
              <>
                {params.row.city4_name} &nbsp;{" "}
                {params.row.percentage_city4_name}%
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "city5_name",
      headerName: "City 5",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city5_name ? (
              <>
                {params.row.city5_name} &nbsp;{" "}
                {params.row.percentage_city5_name}%
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "male_percent",
      headerName: "Male %",
      width: 150,
    },
    {
      field: "female_percent",
      headerName: "Female %",
      width: 150,
    },
    {
      field: "Age_13_17_percent",
      headerName: "Age 13-17 %",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.Age_13_17_percent ? (
              <>
                {params.row.Age_13_17_percent} &nbsp;{" "}
                {params.row.Age_upload_url && (
                  <a
                    key="cityVdo"
                    href={params.row.Age_upload_url}
                    title="Age Img"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "Age_18_24_percent",
      headerName: "Age 18-24 %",
      width: 150,
    },
    {
      field: "Age_25_34_percent",
      headerName: "Age 25-34 %",
    },
    {
      field: "Age_35_44_percent",
      headerName: "Age 35-44 %",
    },
    {
      field: "Age_45_54_percent",
      headerName: "Age 45-54 %",
    },
    {
      field: "Age_55_64_percent",
      headerName: "Age 55-64 %",
    },
    {
      field: "Age_65_plus_percent",
      headerName: "Age 65+ %",
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.start_date ? (
              <>
                {new Date(params.row.start_date).toISOString().substr(8, 2)}/
                {new Date(params.row.start_date).toISOString().substr(5, 2)}/
                {new Date(params.row.start_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "story_view_date",
      headerName: "Story View Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view_date ? (
              <>
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.end_date ? (
              <>
                {new Date(params.row.end_date).toISOString().substr(8, 2)}/
                {new Date(params.row.end_date).toISOString().substr(5, 2)}/
                {new Date(params.row.end_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "creation_date",
      headerName: "Creation Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(2, 2)}
          </div>
        );
      },
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         onClick={() => handleDeleteRowData(params.row)}
    //         variant="contained"
    //         color="primary"
    //       >
    //         Delete
    //       </Button>
    //     );
    //   },
    // },
  ];
  const SkeletonLoading = () => {
    return (
      <ContentLoader
        width={1200}
        height={400}
        viewBox="0 0 1200 400"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="27" y="139" rx="4" ry="4" width="20" height="20" />
        <rect x="67" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="188" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="402" y="140" rx="10" ry="10" width="85" height="19" />
        <rect x="523" y="141" rx="10" ry="10" width="169" height="19" />
        <rect x="731" y="139" rx="10" ry="10" width="85" height="19" />
        <rect x="852" y="138" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="196" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="197" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="198" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="196" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="195" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="258" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="259" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="260" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="258" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="257" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="316" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="317" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="318" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="316" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="315" rx="10" ry="10" width="85" height="19" />

        <rect x="26" y="379" rx="4" ry="4" width="20" height="20" />
        <rect x="66" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="187" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="401" y="380" rx="10" ry="10" width="85" height="19" />
        <rect x="522" y="381" rx="10" ry="10" width="169" height="19" />
        <rect x="730" y="379" rx="10" ry="10" width="85" height="19" />
        <rect x="851" y="378" rx="10" ry="10" width="85" height="19" />

        <rect x="978" y="138" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="195" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="257" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="315" rx="10" ry="10" width="169" height="19" />
        <rect x="977" y="378" rx="10" ry="10" width="169" height="19" />

        <circle cx="37" cy="97" r="11" />
        <rect x="26" y="23" rx="5" ry="5" width="153" height="30" />
        <circle cx="77" cy="96" r="11" />
      </ContentLoader>
    );
  };

  return (
    <div>
      <FormContainer mainTitle="All Pages Detailed" link="/ip-master" />
      <div className="card body-padding fx-head thm_table">

        {!loading && (
          <DataGrid
            rows={allPagesDetail}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 50,
                },
              },
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
            pageSizeOptions={[5, 25, 50, 100, 500]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
            unstable_ignoreValueFormatterDuringExport
          />
        )}

        {loading && <SkeletonLoading />}
      </div>

      <DeleteHistoryConfirmation
        handleCloseDeleteHistoryConFirmation={
          handleCloseDeleteHistoryConFirmation
        }
        openDeleteHistoryConFirmation={openDeleteHistoryConFirmation}
        rowData={rowData}
        apiCall={apiCall}
      />
    </div>
  );
}
