import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormContainer from "../FormContainer";
import Modal from "react-modal";
import DeleteButton from "../DeleteButton";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const ProductOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");
  const [contextData, setDatas] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    axios.get(baseUrl+"get_all_products").then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.Product_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Product Name",
      width: "15%",
      selector: (row) => row.Product_name,
    },
    {
      name: "Duration",
      selector: (row) => row.Duration,
    },
    {
      name: "Product Type",
      width: "15%",
      selector: (row) => row.Product_type,
    },
    {
      name: "Stock Qty",
      selector: (row) => row.Stock_qty,
    },

    {
      name: "Image",
      selector: (row) => {
        return (
          <img
            className="tbl_prdct_img"
            // height={40}
            // width={40}
            src={row.Product_image_download_url}
            alt="Image"
            style={{ height: "90px", width: "90px" }}
            onClick={() => handleImageClick(row.Product_image_download_url)}
          />
        );
      },
    },
    {
      name: "Remark",
      selector: (row) => row.Remarks,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[5] &&
            contextData[5].update_value === 1 && (
              <Link to="/admin/product-update">
                <div className="icon-1"  title="Edit" onClick={() => {
                    setToLocalStorage(
                      row.product_id,
                      row.Product_name,
                      row.Product_type,
                      row.Product_image,
                      row.Duration,
                      row.Stock_qty,
                      row.Unit,
                      row.Opening_stock,
                      row.Opening_stock_date,
                      row.props1,
                      row.props2,
                      row.props3,
                      row.Remarks,
                      row.creation_date,
                      row.Created_by,
                      row.Last_updated_by,
                      row.Last_updated_date
                    );
                  }}>
                    <i class="bi bi-pencil"></i>
                  </div>
                {/* <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                  
                >
                  <FaEdit />{" "}
                </button> */}
              </Link>
            )}
          {contextData &&
            contextData[5] &&
            contextData[5].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_productdelete"
                id={row.product_id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  const setToLocalStorage = (
    product_id,
    Product_name,
    Product_type,
    Product_image,
    Duration,
    Stock_qty,
    Unit,
    Opening_stock,
    Opening_stock_date,
    props1,
    props2,
    props3,
    Remarks,
    creation_date,
    Created_by,
    Last_updated_by,
    Last_updated_date
  ) => {
    localStorage.setItem("product_id", product_id);
    localStorage.setItem("Product_name", Product_name);
    localStorage.setItem("Product_type", Product_type);
    localStorage.setItem("Product_image", Product_image);
    localStorage.setItem("Duration", Duration);
    localStorage.setItem("Stock_qty", Stock_qty);
    localStorage.setItem("Unit", Unit);
    localStorage.setItem("Opening_stock", Opening_stock);
    localStorage.setItem("Opening_stock_date", Opening_stock_date);
    localStorage.setItem("props1", props1);
    localStorage.setItem("props2", props2);
    localStorage.setItem("props3", props3);
    localStorage.setItem("Remarks", Remarks);
    localStorage.setItem("Creation_date", creation_date);
    localStorage.setItem("Created_by", Created_by);
    localStorage.setItem("Last_updated_by", Last_updated_by);
    localStorage.setItem("Last_updated_date", Last_updated_date);
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEnlargedImageUrl("");
  };

  return (
    <>
      <FormContainer
        mainTitle="Product"
        link="/admin/product-master"
        buttonAccess={
          contextData &&
          contextData[5] &&
          contextData[5].insert_value === 1 &&
          true
        }
      />

      <div className="card">
        <div className="card-header sb">
          Product Overview

          <input
            type="text"
            placeholder="Search here"
            className="w-50 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body">

          <DataTable
         
            columns={columns}
            data={filterData}
            pagination 
            selectableRows
          />
        </div>
        <div className="data_tbl table-responsive">
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <img
          src={enlargedImageUrl}
          alt="Enlarged Image"
          style={{ maxWidth: "350px", maxHeight: "100%" }}
        />
      </Modal>
    </>
  );
};

export default ProductOverview;
