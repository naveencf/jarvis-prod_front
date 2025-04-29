import React from "react";
import { Box, Button } from "@mui/material";
import View from "../../Account/View/View";
import { useGetSlabDataByIdQuery } from "../../../../Store/API/Sales/SalesBonusApi.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ViewSlabModal = ({ id, closeModal }) => {
  console.log("id", id);
  const {
    data: newSlabData,
    isLoading: slabLoading,
    isFetching: slabFetching,
    error: slabError,
    refetch: slabRefetch,
  } = useGetSlabDataByIdQuery(id);

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (_, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },

    {
      key: "min",
      name: "Min Amount",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "max",
      name: "Max Amount",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "bonus_amount",
      name: "Bonus Amount",
      showCol: true,
      width: 100,
      getTotal: true,
    },
  ];
  return (
    <>
      <Box sx={style}>
        <div className="lg:col-span-12 col-span-12">
          <View
            columns={columns}
            data={newSlabData?.slabData}
            isLoading={slabLoading || slabFetching}
            title={newSlabData?.slabName}
            tableName={"Bonus-Structure1"}
            pagination
          />
        </div>
        <Button variant="contained" onClick={closeModal}>
          Close
        </Button>
      </Box>
    </>
  );
};

export default ViewSlabModal;
