import { Modal, Box, Button, TextField } from "@mui/material";
import View from "../AdminPanel/Sales/Account/View/View";
import formatString from "../../utils/formatString";

const CreatorAnalysisModel = ({ open, handleClose, creatorData }) => {
  const columns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      name: "Creator Name",
      key: "creatorName",
      width: 150,
      renderRowCell: (row) => formatString(row.creatorName),
    },
    {
      name: "Post Count",
      key: "postCount",
      width: 150,
      renderRowCell: (row) => row.postCount,
    },
    {
      name: "Total Spend",
      key: "totalSpend",
      width: 150,
      renderRowCell: (row) => row.totalSpend.toFixed(0),
    },
    {
      name: "Like Spend",
      key: "likesSpend",
      width: 150,
      renderRowCell: (row) => row.likesSpend.toFixed(0),
    },
    {
      name: "View Spend",
      key: "viewsSpend",
      width: 150,
      renderRowCell: (row) => row.viewsSpend.toFixed(0),
    },
    {
      name: "Date",
      key: "date",
      width: 150,
      renderRowCell: (row) => row.date,
    },
  ];
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          width: 1100,
          margin: "auto",
          mt: 5,
          borderRadius: 2,
        }}
      >
        <View
          version={1}
          data={creatorData}
          columns={columns}
          title={`Creator`}
        />
      </Box>
    </Modal>
  );
};

export default CreatorAnalysisModel;
