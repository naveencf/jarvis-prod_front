import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import { useGetAllBonusMasterDataQuery } from "../../../../Store/API/Sales/SalesBonusApi";
import View from "../../Account/View/View";
import FormContainer from "../../../FormContainer";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import BonusMastUserListModal from "./BonusMastUserListModal";
import { useGlobalContext } from "../../../../../Context/Context";
import ViewSlabModal from "./ViewSlabModal.jsx";

const BonusMastOverview = () => {
  const [rowData, setRowData] = useState(null);
  const [modalName, setModalName] = useState("slab");
  const { toastAlert, toastError } = useGlobalContext();

  const { data: getAllBonus, isLoading: bonusLoading } =
    useGetAllBonusMasterDataQuery();

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (row, name) => {
    setModalOpen(true);
    setRowData(row._id);
    setModalName(name);
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
    },
    {
      key: "bonus_name",
      name: "Bonus Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "user_count",
      name: "Assign Bonus",
      renderRowCell: (row) => (
        <>
          <button
            className="btn cmnbtn btn-outline-primary btn_sm mr-2"
            variant="outlined"
            color="primary"
            onClick={() => openModal(row, "assign")}
          >
            {row.user_count}
          </button>
        </>
      ),
      showCol: true,
      width: 100,
    },

    {
      key: "Action",
      name: "Actoin",
      showCol: true,
      width: 100,
      getTotal: true,
      renderRowCell: (row) => (
        <div className="flex-row gap-2">
          <Link to={`/admin/sales/sales-bonus-master-add-edit/${row?._id}`}>
            <button className="icon-1" title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
          <button
            className="icon-1"
            title="View Slab"
            onClick={() => openModal(row, "slab")}
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      ),
    },
  ];

  let modalmapping = {
    slab: <ViewSlabModal id={rowData} closeModal={closeModal} />,
    assign: (
      <BonusMastUserListModal rowData={rowData} closeModal={closeModal} />
    ),
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalmapping[modalName]}
      </Modal>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Bonus List Overview"} link={true} />

        <Link to={`/admin/sales/sales-bonus-master-add-edit/${0}`}>
          <button className="btn cmnbtn btn-primary btn_sm">Bonus Add</button>
        </Link>
      </div>

      <View
        columns={columns}
        data={getAllBonus}
        isLoading={bonusLoading}
        title={"Overview"}
        tableName={"Bonus Master Overview"}
        pagination={true}
      />
    </>
  );
};

export default BonusMastOverview;
