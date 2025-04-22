import { useState } from "react";
// import SalesBonusModal from "./SalesBonusModal";
import Button from "@mui/material/Button";
import { useGetSalesBonusByIdQuery } from "../../../Store/API/Sales/SalesBonusApi";
import { useParams } from "react-router-dom";
import View from "../Account/View/View";
import Modal from "@mui/material/Modal";
import SalesBonusModal from "./SalesBonusModal";

const SalesBonusSlab = () => {
  const { id } = useParams();
  console.log(id + "id");
  const { data: bonusByID, isLoading: BonusLoading } =
    useGetSalesBonusByIdQuery(id);
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
      key: "bonus_name",
      name: "Bonus Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "Action",
      name: "Action",
      renderRowCell: (row) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => openModal(row)}
          >
            Slab
          </Button>
        </>
      ),
      showCol: true,
      width: 100,
    },
  ];

  return (
    <>
      <div className="lg:col-span-12 col-span-12">
        <View
          columns={columns}
          data={bonusByID?.assignedSlabs}
          isLoading={BonusLoading}
          title={"Bonus Type"}
          tableName={"Bonus Slabe"}
        />
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SalesBonusModal
          rowData={rowData}
          BonusLoading={BonusLoading}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
};

export default SalesBonusSlab;
