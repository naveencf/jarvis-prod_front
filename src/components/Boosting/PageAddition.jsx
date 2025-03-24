import React, { useState } from 'react';
import { Button } from '@mui/material';
import PageAdditionModal from './PageAdditionModal';
import { useDeleteBoostingCreatorMutation, useGetBoostingCreatorsQuery } from '../Store/API/Boosting/BoostingApi';
import View from '../AdminPanel/Sales/Account/View/View';
import Swal from 'sweetalert2';


const PageAddition = () => {
  const [open, setOpen] = useState(false);
  const { data: boostedPages, error, isLoading, isFetching, refetch } = useGetBoostingCreatorsQuery()
  const [deleteBoostingCreator] = useDeleteBoostingCreatorMutation();

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
      renderRowCell: (row) => row.creatorName,
    },
    {
      name: "Post Min Count",
      key: "post_min_count",
      width: 100,
      renderRowCell: (row) => row.post_min_count,
    },
    {
      name: "Post Max Count",
      key: "post_max_count",
      width: 100,
      renderRowCell: (row) => row.post_max_count,
    },
    {
      name: "Reel Min Count",
      key: "reel_min_count",
      width: 100,
      renderRowCell: (row) => row.reel_min_count,
    },
    {
      name: "Reel Max Count",
      key: "reel_max_count",
      width: 100,
      renderRowCell: (row) => row.reel_max_count,
    },
    {
      name: "Share Min Count",
      key: "share_min_count",
      width: 100,
      renderRowCell: (row) => row.share_min_count,
    },
    {
      name: "Share Max Count",
      key: "share_max_count",
      width: 100,
      renderRowCell: (row) => row.share_max_count,
    },
    {
      name: "Created At",
      key: "createdAt",
      width: 150,
      renderRowCell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      name: "Updated At",
      key: "updatedAt",
      width: 150,
      renderRowCell: (row) => new Date(row.updatedAt).toLocaleString(),
    },
    {
      name: "Action",
      key: "action",
      width: 100,
      renderRowCell: (
        row,
      ) => (
        <div className="d-flex gap-2">
          { (
              <button
                className="btn btn-sm cmnbtn btn-danger"
                onClick={() => handleDelete(row?._id)}
                title="Save"
                // disabled={row.audit_status !== "purchased"}
              >
                Delete
              </button>
            )}
        </div>
      ),
    },
  ];
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBoostingCreator(id).unwrap();
          refetch()
          Swal.fire("Deleted!", "The boosting creator has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
          console.error("Error deleting:", error);
        }
      }
    });
  };
  return (
    <div>
      <Button variant="contained" className='mb-3' color="primary" onClick={() => setOpen(true)}>
        Add Page
      </Button>
      <PageAdditionModal open={open} handleClose={() => setOpen(false)} />
      <View
      pagination
        version={1}
        data={boostedPages}
        columns={columns}
        title={`Records`}
        // rowSelectable={true}
        // selectedData={handleSelection}
        tableName={"boosting-pages"}
        isLoading={isFetching|| isLoading}
      />
    </div>
  );
};

export default PageAddition;
