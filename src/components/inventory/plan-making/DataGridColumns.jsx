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
      name: 'S No',
      renderRowCell: (row) => filterData?.indexOf(row) + 1,
      width: 30,
      showCol: true,
    },
    {
      key: 'page_name',
      name: 'Page Name',
      renderRowCell: (row) => formatString(row?.page_name),
      width: 200,
      showCol: true,
    },
    // {
    //   key: 'logo',
    //   name: 'Logo',
    //   renderRowCell: (row) => {
    //     const name = `https://storage.googleapis.com/insights_backend_bucket/cr/${row?.page_name}.jpeg`;
    //     return (
    //       <Avatar
    //         src={name}
    //         alt={row?.page_name}
    //         style={{ width: '50px', height: '50px' }}
    //       />
    //     );
    //   },
    //   width: 150,
    //   showCol: true,
    // },
    {
      key: 'logo',
      name: 'Logo',
      width: 70,
      renderRowCell: (row) => {
        const name = `https://storage.googleapis.com/insights_backend_bucket/cr/${row.page_name}.jpeg`;
        return (
          <div className="profile-sec sb">
            <div className="profile-img">
              <a
                target="_blank"
                rel="noreferrer"
                href={row.page_link}
                className="link-primary"
              >
                <img src={name} alt={row.page_name} width={40} />
              </a>
            </div>
          </div>
        );
      },
    },

    {
      key: 'vendor',
      name: 'Vendor',
      renderRowCell: (row) => {
        const name = vendorData?.find(
          (item) => item?._id === row?.vendor_id
        )?.vendor_name;
        return formatString(name);
      },
      width: 250,
      showCol: true,
      compare: true,
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
      showCol: false,
    },
    {
      key: 'followers_count',
      name: 'Followers',
      renderRowCell: (row) => (
        <div title={row.followers_count}>
          {formatNumber(row.followers_count)}
        </div>
      ),
      width: 150,
      showCol: true,
    },

    {
      key: 'ownership_type',
      name: 'Ownership',
      renderRowCell: (row) => <div>{row.ownership_type}</div>,
      width: 100,
      showCol: true,
    },
    {
      key: 'sub_category',
      name: 'Sub-Category',
      renderRowCell: (row) => formatString(row.page_sub_category_name),
      width: 100,
      showCol: true,
    },
    {
      key: 'selection',
      name: 'Selection',
      renderRowCell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows?.some(
            (selectedRow) => selectedRow?._id === row?._id
          )}
          onChange={handleCheckboxChange(row)}
        />
      ),
      width: 50,
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
      width: 50,
      showCol: true,
    },
    {
      key: 'average_post_price',
      name: 'Average Post Price',
      renderRowCell: (row) => {
        const mPostPrice = row?.page_price_list;
        const postDetail = mPostPrice?.find(
          (item) => item.instagram_post !== undefined
        );
        const postPrice = postDetail?.instagram_post || 0; // Use 0 if postPrice is not available
        const followerCount = row?.followers_count || 0;

        // Calculate the average price only if followerCount is greater than zero
        const averagePostPrice = followerCount
          ? Math.floor(postPrice / (followerCount / 1000000))
          : 0;

        return averagePostPrice;
      },
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: 'average_story_price',
      name: 'Average Story Price',
      renderRowCell: (row) => {
        const mStoryPrice = row?.page_price_list;
        const postDetail = mStoryPrice?.find(
          (item) => item.instagram_story !== undefined
        );
        const storyPrice = postDetail?.instagram_story || 0;
        const followerCount = row?.followers_count || 0;

        // Calculate the average price only if followerCount is greater than zero
        const averageStoryPrice = followerCount
          ? Math.floor(storyPrice / (followerCount / 1000000))
          : 0;

        return followerCount ? averageStoryPrice : 0;
      },
      width: 150,
      showCol: true,
      compare: true,
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
      width: 50,
      showCol: true,
    },
    {
      key: 'total_cost',
      name: 'Total Cost',
      renderRowCell: (row) => (
        <div style={{ border: '1px solid red', padding: '10px' }}>
          {'₹'}
          {showTotalCost[row?._id]
            ? Math.floor(totalCostValues[row?._id]) || 0
            : '-'}
        </div>
      ),
      width: 50,
      showCol: true,
    },
    {
      key: 'preference_level',
      name: 'Level',
      renderRowCell: (row) => <div>{formatString(row?.preference_level)}</div>,
      width: 100,
      showCol: true,
    },
    {
      key: 'page_activeness',
      name: 'Activeness',
      renderRowCell: (row) => {
        return formatString(row?.page_activeness);
      },
      width: 100,
      showCol: true,
    },
    {
      key: 'vendor_type',
      name: 'Vendor Type',
      renderRowCell: (row) => {
        const name = vendorData?.find(
          (item) => item?._id == row?.vendor_id
        )?.vendor_type;
        const finalName = typeData?.find(
          (item) => item?._id === name
        )?.type_name;
        return <div>{finalName}</div>;
      },
      width: 100,
      showCol: true,
    },
    {
      key: 'page_category_name',
      name: 'Category',
      renderRowCell: (row) => (
        <div>{formatString(row?.page_category_name)}</div>
      ),
      // renderRowCell: (row) => {
      //   const name = cat?.find(
      //     (item) => item?._id === row?.page_category_id
      //   )?.page_category;
      //   return <div>{formatString(name)}</div>;
      // },
      width: 100,
      showCol: true,
    },
    {
      key: 'platform_name',
      name: 'Platform',
      renderRowCell: (row) => <div>{formatString(row?.platform_name)}</div>,
      // renderRowCell: (row) => {
      //   const name = platformData?.find(
      //     (item) => item?._id === row.platform_id
      //   )?.platform_name;
      //   return <div>{name}</div>;
      // },
      width: 150,
      showCol: true,
    },
    {
      key: 'page_status',
      name: 'Status',
      renderRowCell: (row) => <div>{row?.page_status}</div>,
      width: 100,
      showCol: true,
    },
  ];

  const pageDetailColumn = [
    {
      key: 'm_post_price',
      name: 'Cost Per Post',
      renderRowCell: (row) => {
        const mPostPrice = row?.page_price_list;
        const postDetail = mPostPrice?.find(
          (item) => item.instagram_post !== undefined
        );
        const postPrice = postDetail?.instagram_post;
        // console.log('most', mPostPrice);
        // const postPrice = row?.post;
        // return <div>{postPrice ?? mPostPrice}</div>;
        return <div>{postPrice ?? 'Price is not available'}</div>;
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'm_story_price',
      name: 'Cost Per Story',
      renderRowCell: (row) => {
        const mStoryPrice = row?.page_price_list;
        const postDetail = mStoryPrice?.find(
          (item) => item.instagram_story !== undefined
        );
        const storyPrice = postDetail?.instagram_story;
        // const storyPrice = row?.story;
        // return <div>{storyPrice ?? mStoryPrice}</div>;
        return <div>{storyPrice ?? 'Price is not available'}</div>;
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'm_both_price',
      name: 'Both Price',
      renderRowCell: (row) => {
        const mBothPrice = row?.page_price_list;
        const postDetail = mBothPrice?.find(
          (item) => item.instagram_both !== undefined
        );
        const bothPrice = postDetail?.instagram_both;
        // const bothPrice = row?.both_;
        // return <div>{bothPrice ?? mBothPrice}</div>;
        return <div>{bothPrice ?? 'Price is not available'}</div>;
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
