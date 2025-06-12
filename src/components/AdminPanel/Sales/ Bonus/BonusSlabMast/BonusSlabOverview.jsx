import React, { useState } from "react";
import FormContainer from "../../../FormContainer";
import View from "../../Account/View/View";
import { useGetAllSlabQuery } from "../../../../Store/API/Sales/SalesBonusApi";
import ViewSlabModal from "../BonusMast/ViewSlabModal";
import Modal from "@mui/material/Modal";

const BonusSlabOverview = () => {
  const { data: getAllSlab, isLoading: slabLoading } = useGetAllSlabQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState(null);

  const openModal = (row) => {
    setModalOpen(true);
    setRowData(row);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },

    {
      key: "slabName",
      name: "Slab Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "Action",
      name: "Action",
      renderRowCell: (row) => (
        <>
          <button
            className="btn cmnbtn btn-outline-primary btn_sm mr-2"
            onClick={() => openModal(row)}
          >
            View
          </button>
        </>
      ),
      showCol: true,
      width: 100,
    },
  ];

  return (
    <>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Slab Overview"} link={true} />
        {/* <div className="d-flex ">
          <Link to={`/admin/sales/sales-bonus-slab-master-add-edit/${0}`}>
            <button className="btn cmnbtn btn-primary btn_sm mr-2">
              Add Slab
            </button>
          </Link>
        </div> */}
      </div>

      <View
        columns={columns}
        data={getAllSlab}
        isLoading={slabLoading}
        title={"Slab"}
        tableName={"Slab-Overview-Modal"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ViewSlabModal
          rowData={rowData}
          slabLoading={slabLoading}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
};

export default BonusSlabOverview;
