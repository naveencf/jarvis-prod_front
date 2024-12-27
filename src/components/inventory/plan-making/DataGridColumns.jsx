import { Avatar, Checkbox } from '@mui/material';
import formatString from '../../../utils/formatString';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DataGridColumns = ({
  vendorData,
  // filterData,
  selectedRows,
  handleCheckboxChange,
  postPerPageValues,
  handlePostPerPageChange,
  storyPerPageValues,
  handleStoryPerPageChange,
  showTotalCost,
  totalCostValues,
  shortcutTriggered,
  setShortcutTriggered,
  typeData,
  pageStatsAuth,
  // cat,
  // platformData,
  // handleRowClick,
  // tempIndex,
  decodedToken,
  activeIndex,
}) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const handleEdit = (row) => {
    sessionStorage.setItem('token', token);
    navigate(`/admin/pms-page-edit/${row._id}`);
  };
  const dataGridColumns = [
    {
      key: 'serial_no',
      name: 'S No',
      renderRowCell: (row, index) => index + 1,
      width: 30,
      showCol: true,
      compare: true,
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
      renderRowCell: (row) =>
        // <div title={row.followers_count}>
        formatNumber(Number(row.followers_count)),
      // </div>
      width: 150,
      showCol: true,
      getTotal: true,
    },

    {
      key: 'ownership_type',
      name: 'Ownership',
      renderRowCell: (row) => row.ownership_type,
      width: 100,
      showCol: true,
    },
    {
      key: 'name_type',
      name: 'Name Type',
      renderRowCell: (row) => row.page_name_type,
      width: 100,
      showCol: true,
    },
    {
      key: 'page_sub_category_name',
      name: 'Sub-Category',
      renderRowCell: (row) => formatString(row.page_sub_category_name),
      width: 100,
      showCol: true,
    },
    {
      key: 'Action',
      name: 'Action',
      width: 150,
      renderRowCell: (row) => (
        <div
        // className="flexCenter colGap8"
        >
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />{' '}
          </button>
        </div>
      ),
    },
    {
      key: 'engagment_rate',
      name: 'Engagment Rate',
      renderRowCell: (row) => row.engagment_rate,
      width: 100,
      showCol: true,
      compare: true,
    },
    {
      key: 'page_check',
      name: 'Selection',
      renderRowCell: (row, index) => (
        <div
          style={{
            border: activeIndex === index ? '1px solid red' : '',
            padding: '10px',
          }}
        >
          <input
            type="checkbox"
            checked={selectedRows?.some(
              (selectedRow) => selectedRow?._id === row?._id
            )}
            // onClick={handleCheckboxChange(row, "column")}
            // onClick={(event) => handleCheckboxChange(row, 'column', event, index)}
            onChange={(event) => {
              // Skip if triggered by a shortcut
              if (shortcutTriggered) return;
              handleCheckboxChange(row, 'column', event, index);
            }}
            onClick={() => setShortcutTriggered(false)}
          // onClick={() => handleRowClick(row)}
          />
        </div>
      ),
      width: 50,
      showCol: true,
      // colorRow: (row, index) => {
      //   if (activeIndex == index) {
      //     // console.log(index);
      //     return '#c4fac4';
      //   }
      //   // else {
      //   //   return "#ffff008c";
      //   // }
      // },
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
      compare: true,
    },
    {
      key: 'average_post_price',
      name: 'Average Post Price',
      renderRowCell: (row) => {
        const mPostPrice = row?.page_price_list;
        const postDetail = mPostPrice?.find(
          (item) => item.instagram_post !== undefined
        );
        const postPrice = postDetail?.instagram_post || 0;
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
      getTotal: true,
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
      getTotal: true,
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
      renderRowCell: (row) =>
        showTotalCost[row?._id]
          ? Math.floor(totalCostValues[row?._id]) || 0
          : 0,
      // <div style={{ border: '1px solid red', padding: '10px' }}>
      // {'₹'}
      // {showTotalCost[row?._id]
      //   ? Math.floor(totalCostValues[row?._id]) || 0
      //   : '-'}
      // </div>
      width: 50,
      showCol: true,
      compare: true,
      getTotal: true,
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
        const findPostPrice = (priceList, keyword) => {
          const detail = priceList?.find((item) =>
            Object.keys(item).some((key) => key.includes(keyword))
          );

          return detail
            ? detail[Object.keys(detail).find((key) => key.includes(keyword))]
            : 0;
        };

        const postPrice = findPostPrice(row?.page_price_list, 'post');

        const price = Number(postPrice) || 0;
        // console.log('most', mPostPrice);
        // const postPrice = row?.post;
        // return <div>{postPrice ?? mPostPrice}</div>;
        return price;
      },
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: 'm_story_price',
      name: 'Cost Per Story',
      renderRowCell: (row) => {
        const findStoryPrice = (priceList, keyword) => {
          const detail = priceList?.find((item) =>
            Object.keys(item).some((key) => key.includes(keyword))
          );

          return detail
            ? detail[Object.keys(detail).find((key) => key.includes(keyword))]
            : 0;
        };

        const storyPrice = findStoryPrice(row?.page_price_list, 'story');

        const price = Number(storyPrice) || 0;
        // const storyPrice = row?.story;
        // return <div>{storyPrice ?? mStoryPrice}</div>;
        return price;
      },
      width: 150,
      showCol: true,
      compare: true,
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
        const price = Number(bothPrice) || 0;
        // const bothPrice = row?.both_;
        // return <div>{bothPrice ?? mBothPrice}</div>;
        return price;
      },
      width: 150,
      showCol: true,
      compare: true,
    },
  ];

  // Push pageDetailColumn to dataGridColumns if conditions are met
  if (!pageStatsAuth || decodedToken?.role_id === 1) {
    dataGridColumns.push(...pageDetailColumn);
  }

  return { dataGridColumns, pageDetailColumn };
};

export default DataGridColumns;
