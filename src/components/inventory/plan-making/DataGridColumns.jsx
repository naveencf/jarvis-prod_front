import { Checkbox } from '@mui/material';

// DataGrid columns for the PlanMaking component
export const dataGridColumns = ({
  vendorData,
  selectedRows,
  handleCheckboxChange,
  postPerPageValues,
  handlePostPerPageChange,
  storyPerPageValues,
  handleStoryPerPageChange,
  totalCostValues,
  showTotalCost,
  typeData,
  cat,
  platformData,
}) => {
  return [
    {
      field: 'S.NO',
      headerName: 'Count',
      renderCell: (params) => <div>{params.api.getRowIndex(params.row.id) + 1}</div>,
      width: 80,
    },
    {
      field: 'page_name',
      headerName: 'Page Name',
      width: 200,
      editable: true,
    },
    {
      field: 'Vendor',
      headerName: 'Vendor',
      width: 200,
      renderCell: (params) => {
        let name = vendorData?.find((item) => item?._id === params.row?.vendor_id)?.vendor_name;
        return <div>{name}</div>;
      },
    },
    {
      field: 'page_link',
      headerName: 'Page Link',
      width: 200,
      editable: true,
      renderCell: (params) => {
        return (
          <a
            target="_blank"
            rel="noreferrer"
            href={params.row.page_link}
            className="link-primary"
          >
            {params.row.page_link}
          </a>
        );
      },
    },
    {
      field: 'followers_count',
      headerName: 'Followers',
      width: 100,
    },
    {
      field: 'ownership_type',
      headerName: 'Ownership',
      width: 100,
    },
    {
      field: 'est_update',
      headerName: 'Selection',
      width: 100,
      renderCell: (params) => {
        return (
          <Checkbox
            checked={selectedRows.some((row) => row._id === params.row._id)}
            onChange={handleCheckboxChange(params.row)}
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Post Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{ width: '70%' }}
            value={postPerPageValues[params.row._id] || ''}
            onChange={handlePostPerPageChange(params.row)}
          />
        );
      },
    },
    {
      field: 'updated_by',
      headerName: 'Story Per Page',
      width: 150,
      renderCell: (params) => {
        return (
          <input
            type="number"
            style={{ width: '70%' }}
            value={storyPerPageValues[params.row._id] || ''}
            onChange={handleStoryPerPageChange(params.row)}
          />
        );
      },
    },
    {
      field: 'last_updated_by',
      headerName: 'Total Cost',
      width: 100,
      renderCell: (params) => {
        return (
          <div style={{ border: '1px solid red', padding: '10px' }}>
            {'₹'}
            {showTotalCost[params.row._id] ? totalCostValues[params.row._id] || 0 : '-'}
          </div>
        );
      },
    },
    {
      field: 'preference_level',
      headerName: 'Level',
      width: 200,
      editable: true,
    },
    {
      field: 'Vendor Type',
      headerName: 'Vendor Type',
      width: 200,
      renderCell: (params) => {
        let name = vendorData?.find((item) => item?._id === params.row?.vendor_id)?.vendor_type;
        let finalName = typeData?.find((item) => item?._id === name)?.type_name;
        return <div>{finalName}</div>;
      },
    },
    {
      field: 'page_catg_id',
      headerName: 'Category',
      width: 200,
      renderCell: (params) => {
        let name = cat?.find((item) => item?._id === params.row?.page_category_id)?.page_category;
        return <div>{name}</div>;
      },
    },
    {
      field: 'platform_id',
      headerName: 'Platform',
      renderCell: (params) => {
        let name = platformData?.find((item) => item?._id === params.row.platform_id)?.platform_name;
        return <div>{name}</div>;
      },
      width: 150,
    },
    { field: 'page_status', headerName: 'Status', width: 100 },
  ];
};

export const pageDetailColumn = [
  {
    field: 'm_post_price',
    headerName: 'Cost Per Post',
    width: 150,
    valueGetter: ({ row }) => {
      let mPostPrice = row.m_post_price;
      let postPrice = row.post;
      return postPrice ?? mPostPrice;
    },
  },
  {
    field: 'm_story_price',
    headerName: 'Cost Per Story',
    width: 150,
    valueGetter: ({ row }) => {
      let mStoryPrice = row.m_story_price;
      let storyPrice = row.story;
      return storyPrice ?? mStoryPrice;
    },
  },
  {
    field: 'm_both_price',
    headerName: 'Both Price',
    width: 150,
    valueGetter: ({ row }) => {
      let mBothPrice = row.m_both_price;
      let bothPrice = row.both_;
      return bothPrice ?? mBothPrice;
    },
  },
];
