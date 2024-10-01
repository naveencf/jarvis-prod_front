import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Modal,
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useGetAllPageListQuery } from '../../../Store/PageBaseURL';
import Swal from 'sweetalert2';

const PlanUpload = () => {
  const [fileData, setFileData] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  const [open, setOpen] = useState(false);
  const [pageType, setPageType] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data } = useGetAllPageListQuery();
  const fileInputRef = useRef(null);

  // Function to handle file uploads
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const parsedData = parseFileData(fileContent, fileType);

      const duplicates = findDuplicates(parsedData.subSheetData);
      if (duplicates.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Records Found',
          text: `There are ${
            duplicates.length
          } duplicate records: ${duplicates.join(', ')}`,
        });
        return;
      }

      setFileData(parsedData.subSheetData);
      setOverviewData(parsedData.totalCount);
      setOpen(true);
    };

    reader.readAsBinaryString(file);
  };

  // Function to parse the uploaded file content
  // eslint-disable-next-line no-unused-vars
  const parseFileData = (fileContent, fileType) => {
    const workbook = XLSX.read(fileContent, { type: 'binary', raw: true });
    let subSheetData = [];
    let totalCount = 0;

    workbook.SheetNames.forEach((sheetName) => {
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: '',
      });

      if (sheetName.toLowerCase() === 'overview') {
        totalCount =
          jsonData.find((row) => row.__EMPTY === 'Total')?.__EMPTY_5 || 0;
      } else {
        subSheetData = subSheetData.concat(jsonData);
      }
    });

    return { subSheetData, totalCount };
  };

  // Function to find duplicate records in the uploaded data
  const findDuplicates = (data) => {
    const seen = new Set();
    const duplicates = [];

    data.forEach((item) => {
      const username = item?.Username?.toLowerCase();
      const pageLink = item?.['Profile Link'] || '';
      const isInstagram = pageLink.includes('instagram.com');
      const key = isInstagram ? `${username}-${pageLink}` : null;

      if (key && seen.has(key)) {
        if (!duplicates.includes(item.Username)) {
          duplicates.push(item.Username);
        }
      } else if (key) {
        seen.add(key);
      }
    });

    return duplicates;
  };

  // Function to filter data that matches the fetched pages
  const filterMatchingData = (fileData, pageData) => {
    return pageData?.reduce((acc, page) => {
      const matchedFileData = fileData?.find(
        (fileItem) =>
          (fileItem?.Username?.toLowerCase() ===
            page?.page_name?.toLowerCase() &&
            page?.page_link?.includes('instagram.com')) ||
          page?.page_link?.includes('x.com')
      );

      if (matchedFileData) {
        acc.push({
          ...page,
          post_per_profile: matchedFileData['Posts Per Profile'] || 0,
        });
      }
      return acc;
    }, []);
  };

  // Filter the fetched data and calculate statistics
  const filteredData = filterMatchingData(fileData, data?.data);

  // Filter pages with zero cost and calculate statistics
  const postWithZeroCost = filteredData?.filter(
    (item) => item?.m_post_price === 0
  );
  const totalPostFetchProfile = filteredData?.reduce(
    (acc, val) => acc + (val.post_per_profile || 0),
    0
  );
  const unFetchPost = fileData?.length - filteredData?.length;

  // Categorize the pages based on ownership type
  const categorizePages = (pages, ownershipType, isNotEqual = false) =>
    pages?.filter((page) =>
      isNotEqual
        ? page?.ownership_type !== ownershipType
        : page?.ownership_type === ownershipType
    );

  // Categorize 'Own' and 'Other' pages
  const ownPages = categorizePages(filteredData, 'Own');
  const otherPages = categorizePages(filteredData, 'Own', true);

  // Define table columns for the UI
  const columns = [
    { id: 'sno', label: 'S.No', minWidth: 50 },
    { id: 'page_name', label: 'Page Name', minWidth: 150 },
    { id: 'page_link', label: 'Page Link', minWidth: 150 },
    { id: 'followers_count', label: 'Followers Count', minWidth: 100 },
    { id: 'm_post_price', label: 'Post Price', minWidth: 100 },
    { id: 'm_story_price', label: 'Story Price', minWidth: 100 },
    { id: 'ownership_type', label: 'Ownership Type', minWidth: 100 },
  ];

  // Handle pagination changes
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
    setPageType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate the total post price for own and other pages
  const calculateTotalPostPrice = (pages) =>
    pages?.reduce((acc, val) => acc + val?.m_post_price, 0);
  const ownTotalPostPrice = calculateTotalPostPrice(ownPages);
  const otherTotalPostPrice = calculateTotalPostPrice(otherPages);

  // Function to render the table in the modal
  const renderModalContent = (dataToRender) => (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataToRender
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <TableCell key="sno" align="left">
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {columns
                    .filter((column) => column.id !== 'sno')
                    .map((column) => (
                      <TableCell key={column.id} align="left">
                        {row[column.id]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dataToRender?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

      <Modal open={open} disableEscapeKeyDown={true}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <h2>Page Details</h2>
          <p>Total Pages from Overview: {overviewData}</p>
          <p>
            Fetched Pages: {filteredData?.length - postWithZeroCost?.length}
          </p>
          <p>Fetched Posts: {totalPostFetchProfile}</p>
          <p>Unfetched Pages: {unFetchPost + postWithZeroCost?.length}</p>
          <p>Own page cost: {ownTotalPostPrice}</p>
          <p>Other page cost: {otherTotalPostPrice}</p>

          <Button variant="contained" onClick={() => setPageType('own')}>
            Own-Page: {ownPages?.length}
          </Button>
          <Button
            variant="contained"
            onClick={() => setPageType('other')}
            sx={{ ml: 2 }}
          >
            Other-Page: {otherPages?.length}
          </Button>
          <Button
            variant="contained"
            onClick={() => setPageType('zeroCost')}
            sx={{ ml: 2 }}
          >
            Zero-Cost Pages: {postWithZeroCost?.length}
          </Button>

          <Modal
            open={Boolean(pageType)}
            onClose={() => setPageType(null)}
            disableEscapeKeyDown={true}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                bgcolor: 'background.paper',
                borderRadius: '10px',
                boxShadow: 24,
                p: 4,
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <h3>
                {pageType === 'own'
                  ? 'Own Pages'
                  : pageType === 'other'
                  ? 'Other Pages'
                  : 'Zero-Cost Pages'}{' '}
                Details
              </h3>
              {renderModalContent(
                pageType === 'own'
                  ? ownPages
                  : pageType === 'other'
                  ? otherPages
                  : postWithZeroCost
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setPageType(null)}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </Box>
          </Modal>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
            sx={{ ml: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PlanUpload;
