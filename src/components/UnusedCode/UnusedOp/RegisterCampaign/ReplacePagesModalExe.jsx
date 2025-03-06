import { Box, TextField } from "@mui/material";
import Select from "react-select";

import { Button, Modal, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ReplacePagesModalExe = ({ open, handleClose ,selectedCampaign}) => {
  const [remainingPages, setRemainingPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  console.log(selectedPages, "new value in array");

  const getAllPages = async () => {
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    const remaingData = pageData?.data?.body;
    console.log(remaingData, "new valu");
    setRemainingPages(remaingData);
  };

  useEffect(() => {
    getAllPages();
  }, []);


  const handleSubmit = async () => {

    console.log("handle submit repalce ");
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ mb: 4 }} variant="h6" component="h2">
            Replace Page
          </Typography>

          <div className="form-group col-6">
            <label className="form-label">Pages</label>
            <Select
              isMulti
              options={remainingPages.map((option) => ({
                value: option.p_id,
                label: `${option.page_name}`,
              }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(
                  (option) => option.value
                );
                setSelectedPages(selectedValues);
              }}
            />
          </div>

          <Typography variant="body1">Selected Pages</Typography>
          <Box>
            {selectedPages.map((pageId) => {
              const selectedPage = remainingPages.find(
                (page) => page.p_id === pageId
              );
              return (
                <Box key={pageId}>
                  {selectedPage && (
                    <>
                       <TextField
                       label="Page"
                       value={selectedPage?.page_name}
                       />
                        <TextField
                       label="Follower Count"
                       value={selectedPage?.follower_count}
                       />
                    </>
                  )}

                  <Button onClick={handleSubmit}> Submit</Button>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ReplacePagesModalExe;
