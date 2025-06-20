import { CopySimple, Eye, PencilSimple } from '@phosphor-icons/react';
import { formatUTCDate } from '../../../../utils/formatUTCDate';
import formatString from '../../../../utils/formatString';

const DataGridOverviewColumnsPlanRequest = ({ handleOpenDialog, handleStatusChange, handleDuplicateClick, handleRowClick, handleEditClick }) => {

  function truncateString(inputString, maxLength = 20) {
    return inputString?.length > maxLength ? inputString?.slice(0, maxLength) + '...' : inputString;
  }
  const columns = [
    {
      key: 'serial_no',
      name: 'S.No',
      renderRowCell: (row, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
      width: 70,
      showCol: true,
    },
    {
      key: 'unfetched_pages',
      name: 'Unfetched Pages',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }} onClick={() => handleOpenDialog(row.not_available_pages)}>
          {row.not_available_pages?.length}
        </div>
      ),
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: 'plan_name',
      name: 'Plan Name',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.planName}</div>,
      width: 150,
      showCol: true,
    },
    {
      key: 'profit_percentage',
      name: 'Profit Percentage',
      renderRowCell: (row) => {
        const costPrice = parseFloat(row.costPrice);
        const sellingPrice = parseFloat(row.sellingPrice);
        const profitPercentage = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice) * 100 : 0;
        return (
          <div style={{ cursor: 'pointer' }} title={`${sellingPrice - costPrice}`}>
            {profitPercentage.toFixed(2)}%
          </div>
        );
      },
      width: 150,
      showCol: true,
    },
    {
      key: 'brief',
      name: 'Brief',
      renderRowCell: (row) => <div>
        <span style={{ cursor: 'pointer' }} title={formatString(row?.brief)}>
          {truncateString(formatString(row?.brief))}
        </span>
      </div>,
      width: 150,
      showCol: true,
    },
    {
      key: 'account_name',
      name: 'Account Name',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.account_name}</div>,
      width: 200,
      showCol: true,
    },
    {
      key: 'sales_executive_name',
      name: 'Sales Executive Name',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.sales_executive_name}</div>,
      width: 150,
      showCol: true,
    },
    {
      key: 'created_by_name',
      name: 'Created By',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.created_by_name}</div>,
      width: 150,
      showCol: true,
    },
    {
      key: 'total_profit',
      name: 'Total Profit',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{Math.floor(row.sellingPrice - row.costPrice)}</div>,
      width: 150,
      showCol: true,
    },
    {
      key: 'brief_attachment',
      name: 'Brief Attachment',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>
          <a href={row.planx_log_file} target="_blank" rel="noreferrer" style={{ color: 'blue' }}>
            {row.planx_log_file ? 'Link' : ''}
          </a>
        </div>
      ),
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: 'own_page_cost',
      name: 'Own Pages Cost',
      renderRowCell: (row) => Math.floor(row.own_pages_cost_price),
      width: 150,
      showCol: true,
      compare: true,
    },
    {
      key: 'plan_status',
      name: 'Plan Status',
      renderRowCell: (row) => (
        <div className={`badge ${row.plan_status !== 'close' ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer' }} onClick={() => handleStatusChange(row)}>
          {row.plan_status}
        </div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'cost_price',
      name: 'Cost Price',
      renderRowCell: (row) => Math.floor(row.costPrice),
      width: 120,
      showCol: true,
      compare: true,
    },
    {
      key: 'selling_price',
      name: 'Selling Price',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.sellingPrice}</div>,
      width: 120,
      showCol: true,
      compare: true,
    },
    {
      key: 'pages',
      name: 'No of Pages',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{Number(row.pages)}</div>,
      width: 120,
      showCol: true,
      // compare: true,
    },
    {
      key: 'createdAt',
      name: 'Created Date',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{formatUTCDate(row.createdAt)}</div>,
      width: 120,
      showCol: true,
    },
    {
      key: 'postCount',
      name: 'Post Count',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{Math.floor(Number(row.postCount))}</div>,
      width: 120,
      showCol: true,
    },
    {
      key: 'storyCount',
      name: 'Story Count',
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{Math.floor(Number(row.storyCount))}</div>,
      width: 120,
      showCol: true,
    },
    {
      key: 'description',
      name: 'Description',
      // renderRowCell: (row) => <div style={{ cursor: 'pointer' }}>{row.description}</div>,
      renderRowCell: (row) => <div style={{ cursor: 'pointer' }}> <span style={{ cursor: 'pointer' }} title={formatString(row.description)}>
        {truncateString(formatString(row.description))}
      </span></div>,
      width: 250,
      showCol: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      renderRowCell: (row) => (
        <div className="flexCenter colGap8">
          <button title="Duplicate" onClick={() => handleDuplicateClick(row)} className="btn icon">
            <CopySimple />
          </button>
          {/* <button title="View" className="btn icon" onClick={() => handleRowClick(row)}>
            <Eye />
          </button> */}
          <button title="Edit" className="btn icon" onClick={() => handleEditClick(row)}>
            <PencilSimple />
          </button>
        </div>
      ),
      width: 150,
      showCol: true,
    },
  ];
  return { columns };
};

export default DataGridOverviewColumnsPlanRequest;
