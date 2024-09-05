import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setCloseShowPageInfoModal,
  setModalType,
  setOpenShowAddModal,
  setRowData,
} from "../../Store/PageMaster";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import {
  useGetAllPageCategoryQuery,
  useGetAllProfileListQuery,
  useGetPlatformPriceQuery,
} from "../../Store/PageBaseURL";
import DeleteButton from "../DeleteButton";
import { FaEdit } from "react-icons/fa";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import jwtDecode from "jwt-decode";

export default function PageInfoModal() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showInfoModal);
  const dispatch = useDispatch();
  const modalType = useSelector((state) => state.pageMaster.modalType);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const handleClose = () => {
    dispatch(setCloseShowPageInfoModal());
  };
  const {
    data: profileList,
    error: profileListError,
    isLoading: ProfileListIsloading,
    refetch: refetchProfileList,
  } = useGetAllProfileListQuery();

  // useEffect(() => {
  //   if(open==true){
  //   if (modalType === "Profile Type Info") {
  //     return refetchProfileList();
  //   } else if (modalType === "Category Info") {
  //     refetchCategoryList();
  //   } else if (modalType === "Price Type Info") {
  //     refetchPriceList();
  //   }}  
  // }, []);

  const {
    data: categoryList,
    error: categoryListError,
    isLoading: categoryListIsloading,
    refetch: refetchCategoryList,
  } = useGetAllPageCategoryQuery();

  const handlRowClick = (row, Type) => {
    dispatch(setModalType(Type));
    dispatch(setOpenShowAddModal());
    dispatch(setRowData(row));
  };

  const {
    data: priceList,
    error: priceListError,
    isLoading: priceListIsloading,
    refetch: refetchPriceList,
  } = useGetPlatformPriceQuery();

  const {
    data: platformList,
    error: platformListError,
    isLoading: platformListIsloading,
    refetch: refetchPlatformList,
  } = useGetPmsPlatformQuery();

  const getData = () => {
    handleClose();
    if (modalType === "Profile Type Info") {
      refetchProfileList();
    } else if (modalType === "Category Info") {
      refetchCategoryList();
    } else if (modalType === "Price Type Info") {
      refetchPriceList();
    }
  };

  const profileTypeColumn = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Profile Type",
      selector: (row) => row.profile_type,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handlRowClick(row, "Profile Type Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="v1/profile_type"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const categoryColumn = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Page Category Name",
      selector: (row) => row.page_category,
      // selector: (row) => row.category_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
      {
        name: "Action",
        cell: (row) => (
          <>
          {decodedToken.role_id==1 &&  <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
              onClick={() => handlRowClick(row, "Category Update")}
              data-toggle="modal"
              data-target="#myModal"
            >
              <FaEdit />{" "}
            </button>}
            {/* <DeleteButton endpoint="deletePage" id={row._id} getData={getData} /> */}
          </>
        ),
      },
  ];

  const priceTypeColumn = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Platform Name",
      selector: (row) =>
        platformList?.data?.find((item) => item._id === row.platfrom_id)
          ?.platform_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handlRowClick(row, "Price Type Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="v1/pagePriceType"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (modalType === "Profile Type Info") {
      setTitle("Profile Type");
      setLoading(ProfileListIsloading);
      setData(profileList?.data);
      setColumns(profileTypeColumn);
    } else if (modalType === "Category Info") {
      setTitle("Category");
      setLoading(categoryListIsloading);
      setData(categoryList?.data);
      setColumns(categoryColumn);
    } else if (modalType === "Price Type Info") {
      setTitle("Price Type");
      setLoading(priceListIsloading);
      setData(priceList);
      setColumns(priceTypeColumn);
    }
  }, [modalType]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth={true}
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DataTable
            // title="Profile Overview"
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
