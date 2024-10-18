import { Avatar, Checkbox } from '@mui/material';
import formatString from '../../../utils/formatString';

const DataGridColumns = ({
  vendorData,
  filterData,
  selectedRows,
  handleCheckboxChange,
  postPerPageValues,
  handlePostPerPageChange,
  storyPerPageValues,
  handleStoryPerPageChange,
  showTotalCost,
  totalCostValues,
  typeData,
  cat,
  platformData,
  pageStatsAuth,
  decodedToken,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const dataGridColumns = [
    {
      key: 'serial_no',
      name: 'Count',
      renderRowCell: (row, ) => (
        <div>{filterData?.indexOf(row) + 1}</div>
      ),
      width: 80,
      showCol: true,
    },
    {
      key: 'page_name',
      name: 'Page Name',
      renderRowCell: (row) => (
        <div>{formatString(row?.page_name)}</div>
      ),
      width: 200,
      showCol: true,
    },
    {
      key: 'logo',
      name: 'Logo',
      renderRowCell: (row) => {
        const name = `https://storage.googleapis.com/insights_backend_bucket/cr/${row?.page_name}.jpeg`;
        return (
          <Avatar
            src={name}
            alt={row?.page_name}
            style={{ width: '50px', height: '50px' }}
          />
        );
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'vendor',
      name: 'Vendor',
      renderRowCell: (row) => {
        const name = vendorData?.find(
          (item) => item?._id === row?.vendor_id
        )?.vendor_name;
        return <div>{formatString(name)}</div>;
      },
      width: 200,
      showCol: true,
    },
    {
      key: 'page_link',
      name: 'Page Link',
      renderRowCell: (row) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={row.page_link}
          className="link-primary"
        >
          {row.page_link}
        </a>
      ),
      width: 200,
      showCol: true,
    },
    {
      key: 'followers_count',
      name: 'Followers',
      renderRowCell: (row) => (
        <div title={row.followers_count}>{formatNumber(row.followers_count)}</div>
      ),
      width: 100,
      showCol: true,
    },
    {
      key: 'ownership_type',
      name: 'Ownership',
      renderRowCell: (row) => (
        <div>{row.ownership_type}</div>
      ),
      width: 100,
      showCol: true,
    },
    {
      key: 'selection',
      name: 'Selection',
      renderRowCell: (row) => (
        <Checkbox
          checked={selectedRows?.some((selectedRow) => selectedRow?._id === row?._id)}
          onChange={handleCheckboxChange(row)}
        />
      ),
      width: 100,
      showCol: true,
    },
    {
      key: 'post_per_page',
      name: 'Post Per Page',
      renderRowCell: (row) => (
        <input
          type="number"
          style={{ width: '70%' }}
          value={postPerPageValues[row?._id] || ''}
          onChange={handlePostPerPageChange(row)}
        />
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'story_per_page',
      name: 'Story Per Page',
      renderRowCell: (row) => (
        <input
          type="number"
          style={{ width: '70%' }}
          value={storyPerPageValues[row?._id] || ''}
          onChange={handleStoryPerPageChange(row)}
        />
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'total_cost',
      name: 'Total Cost',
      renderRowCell: (row) => (
        <div style={{ border: '1px solid red', padding: '10px' }}>
          {'₹'}
          {showTotalCost[row?._id]
            ? totalCostValues[row?._id] || 0
            : '-'}
        </div>
      ),
      width: 100,
      showCol: true,
    },
    {
      key: 'preference_level',
      name: 'Level',
      renderRowCell: (row) => (
        <div>{row?.preference_level}</div>
      ),
      width: 200,
      showCol: true,
    },
    {
      key: 'vendor_type',
      name: 'Vendor Type',
      renderRowCell: (row) => {
        const name = vendorData?.find(
          (item) => item?._id === row?.vendor_id
        )?.vendor_type;
        const finalName = typeData?.find(
          (item) => item?._id === name
        )?.type_name;
        return <div>{finalName}</div>;
      },
      width: 200,
      showCol: true,
    },
    {
      key: 'category',
      name: 'Category',
      renderRowCell: (row) => {
        const name = cat?.find(
          (item) => item?._id === row?.page_category_id
        )?.page_category;
        return <div>{name}</div>;
      },
      width: 200,
      showCol: true,
    },
    {
      key: 'platform',
      name: 'Platform',
      renderRowCell: (row) => {
        const name = platformData?.find(
          (item) => item?._id === row.platform_id
        )?.platform_name;
        return <div>{name}</div>;
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'page_status',
      name: 'Status',
      renderRowCell: (row) => (
        <div>{row?.page_status}</div>
      ),
      width: 100,
      showCol: true,
    },
  ];

  const pageDetailColumn = [
    {
      key: 'm_post_price',
      name: 'Cost Per Post',
      renderRowCell: ( row ) => {
        const mPostPrice = row?.m_post_price;
        const postPrice = row?.post;
  
        return <div>{postPrice ?? mPostPrice}</div>;
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'm_story_price',
      name: 'Cost Per Story',
      renderRowCell: (row ) => {
        const mStoryPrice = row?.m_story_price;
        const storyPrice = row?.story;
        return <div>{storyPrice ?? mStoryPrice}</div>;
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'm_both_price',
      name: 'Both Price',
      renderRowCell: ( row ) => {
        const mBothPrice = row?.m_both_price;
        const bothPrice = row?.both_;
        return <div>{bothPrice ?? mBothPrice}</div>;
      },
      width: 150,
      showCol: true,
    },
  ];

  // Push pageDetailColumn to dataGridColumns if conditions are met
  if (!pageStatsAuth || decodedToken?.role_id === 1) {
    dataGridColumns.push(...pageDetailColumn);
  }

  return { dataGridColumns, pageDetailColumn };
};

export default DataGridColumns;
