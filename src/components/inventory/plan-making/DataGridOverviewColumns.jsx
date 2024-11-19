import { CopySimple, Eye, PencilSimple } from '@phosphor-icons/react';
import { formatUTCDate } from '../../../utils/formatUTCDate';

const DataGridOverviewColumns = ({
  handleOpenDialog,
  handleStatusChange,
  handleDuplicateClick,
  handleRowClick,
  handleEditClick,
}) => {
  const columns = [
    {
      key: 'serial_no',
      name: 'S.No',
      renderRowCell: (row, index) => (
        <div style={{ textAlign: 'center' }}>{index + 1}</div>
      ),
      width: 70,
      showCol: true,
    },
    {
      key: 'unfetched_pages',
      name: 'Unfetched Pages',
      renderRowCell: (row) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleOpenDialog(row.not_available_pages)}
        >
          {row.not_available_pages?.length}
        </div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'plan_name',
      name: 'Plan Name',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.planName}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'profit_percentage',
      name: 'Profit Percentage',
      renderRowCell: (row) => {
        const costPrice = parseFloat(row.costPrice);
        const sellingPrice = parseFloat(row.sellingPrice);
        const profitPercentage =
          costPrice > 0 ? ((sellingPrice - costPrice) / costPrice) * 100 : 0;
        return (
          <div
            style={{ cursor: 'pointer' }}
            title={`${sellingPrice - costPrice}`}
          >
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
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.brief}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'account_name',
      name: 'Account Name',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.account_name}</div>
      ),
      width: 200,
      showCol: true,
    },
    {
      key: 'sales_executive_name',
      name: 'Sales Executive Name',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.sales_executive_name}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'created_by_name',
      name: 'Created By',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.created_by_name}</div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'brief_attachment',
      name: 'Brief Attachment',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>
          <a
            href={row.planx_log_file}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'blue' }}
          >
            {row.planx_log_file ? 'Link' : ''}
          </a>
        </div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'plan_status',
      name: 'Plan Status',
      renderRowCell: (row) => (
        <div
          className={`badge ${
            row.plan_status === 'close' ? 'badge-success' : 'badge-danger'
          }`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleStatusChange(row)}
        >
          {row.plan_status}
        </div>
      ),
      width: 150,
      showCol: true,
    },
    {
      key: 'cost_price',
      name: 'Cost Price',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.costPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'selling_price',
      name: 'Selling Price',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.sellingPrice}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'pages',
      name: 'No of Pages',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.pages}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'createdAt',
      name: 'Created Date',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{formatUTCDate(row.createdAt)}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'post_count',
      name: 'Post Count',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.postCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'story_count',
      name: 'Story Count',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.storyCount}</div>
      ),
      width: 120,
      showCol: true,
    },
    {
      key: 'description',
      name: 'Description',
      renderRowCell: (row) => (
        <div style={{ cursor: 'pointer' }}>{row.description}</div>
      ),
      width: 250,
      showCol: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      renderRowCell: (row) => (
        <div className="flexCenter colGap8">
          <button
            title="Duplicate"
            onClick={() => handleDuplicateClick(row)}
            className="btn icon"
          >
            <CopySimple />
          </button>
          <button
            title="View"
            className="btn icon"
            onClick={() => handleRowClick(row)}
          >
            <Eye />
          </button>
          <button
            title="Edit"
            className="btn icon"
            onClick={() => handleEditClick(row)}
          >
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

export default DataGridOverviewColumns;
