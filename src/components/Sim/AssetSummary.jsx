import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import { baseUrl } from "../../utils/config";
import DateISOtoNormal from "../../utils/DateISOtoNormal";
import Modal from "react-modal";

const AssetSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [data, setDatas] = useState([]);

  // useEffect(() => {
  //   axios.get(`${baseUrl}` + `get_all_asset_history`).then((res) => {
  //     setDatas(res.data.results);
  //     console.log(res.data.results);
  //   });
  // }, []);

  const [historyData, setHistoryData] = useState([]);
  const [historyModal, setHistoryModal] = useState(false);
  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_single_asset_history/${row}`
      );
      setHistoryData(response.data.data);
      setHistoryModal(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };

  const handleClosAssetCounteModal = () => {
    setHistoryModal(false);
  };

  function getData() {
    axios.get(baseUrl + "get_all_asset_history").then((res) => {
      setData(res?.data.results);
      setFilterData(res?.data.results);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      console.log(d);
      // return (
      //   d.obj_name?.toLowerCase().includes(search.toLowerCase()) ||
      //   d.soft_name?.toLowerCase().match(search.toLowerCase())
      // );
      return Object.values(d).some(value =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      );
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
      name: "Asset Action by Name",
      selector: (row) => row.asset_action_by_name,
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
    },

    {
      name: "Action Date",
      // selector: (row) => row.asset_action_date_time,
      selector: (row) => DateISOtoNormal(row.asset_action_date_time),
    },
    {
      name: "Remark",
      selector: (row) => row.asset_remark,
    },
    {
      name: "History",
      cell: (row) => (
        <button
          className="btn btn-outline-warning btn-sm"
          onClick={() => handleTotalasset(row.sim_id)}
        >
          History
        </button>
      ),
      sortable: true,
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Asset Summary"
        link="/admin/object-master"
        buttonAccess={false}
      />

      <div className="card">
        <div className="card-header sb">
       <h5>Asset Summary </h5> 
        <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
        </div>
        <div className="card-body body-padding">
        <DataTable
          
            columns={columns}
            data={filterData}
            
            pagination
            selectableRows
            // fixedHeaderScrollHeight="64vh"
            // highlightOnHover
            // subHeader
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search here"
            //     className="w-50 form-control"
            //     value={search}
            //     onChange={(e) => setSearch(e.target.value)}
            //   />
            // }
          />
        </div>
        {/* <div className="data_tbl table-responsive">
          
        </div> */}
      </div>
      <Modal
        isOpen={historyModal}
        onRequestClose={handleClosAssetCounteModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-end mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}

            <button
              className="btn btn-success float-left"
              onClick={handleClosAssetCounteModal}
            >
              X
            </button>
          </div>
         
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              { name: "Asset Name", selector: (row) => row.asset_name },
              {
                name: "Action By Name",
                selector: (row) => row.asset_action_by_name,
              },
              {
                name: "Asset Action",
                selector: (row) => row.asset_action,
              },
              {
                name: "Asset Action Date",
                selector: (row) => DateISOtoNormal(row.asset_action_date_time),
              },
              {
                name: "Remark",
                selector: (row) => row.asset_remark,
              },
            ]}
            data={historyData}
            highlightOnHover
            // subHeade
            pagination
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search..."
            //     className="w-50 form-control"
            //     value={modalSearch}
            //     onChange={(e) => setModalSearch(e.target.value)}
            //   />
            // }
          />
        </div>
        {/* )} */}
      </Modal>
    </>
  );
};

export default AssetSummary;
