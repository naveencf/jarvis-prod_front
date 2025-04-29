import React, { useEffect } from "react";

const PaginationComp = ({
  data,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  Pagination,
  originalData,
  columnsheader,
  isPagination,
  cloudPagination,
  pageNavigator,
}) => {
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  return (
    <div className="footer-pagination">
      {isPagination && (
        <>
          <div className="pagination">
            {/* {Array(Math.ceil(data.length / itemsPerPage)).fill().map((_, index) => (
                          <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={currentPage === index + 1 ? 'active' : ''}
                          >
                          {index + 1}
                          </button>
                      ))} */}
            <button
              className="prev-button"
              {...(cloudPagination
                ? pageNavigator["prev"] // user defined event
                : {
                  onClick: () =>
                    setCurrentPage(
                      currentPage > 1 ? currentPage - 1 : currentPage
                    ),
                  disabled: currentPage === 1,
                })}
            >
              <svg
                fill="var(--medium)"
                height="13px"
                width="13px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 330 330"
                xmlSpace="preserve"
              >
                <path
                  id="XMLID_92_"
                  d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
      l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
      C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"
                />
              </svg>
            </button>

            <button
              className="next-button"
              {...(cloudPagination
                ? pageNavigator["next"]
                : {
                  onClick: () =>
                    setCurrentPage(
                      currentPage < Math.ceil(data.length / itemsPerPage)
                        ? currentPage + 1
                        : currentPage
                    ),
                  disabled:
                    currentPage === Math.ceil(data?.length / itemsPerPage),
                })}
            >
              <svg
                fill="var(--medium)"
                height="13px"
                width="13px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 330 330"
                xmlSpace="preserve"
              >
                <path
                  id="XMLID_222_"
                  d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
      c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
      C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
      C255,161.018,253.42,157.202,250.606,154.389z"
                />
              </svg>
            </button>

            <div className="pagy-current">Current Page: {cloudPagination ? pageNavigator?.currentPage : currentPage}</div>
          </div>
          <div className="pagination-controls">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {Pagination?.map((value, index) => (
                <option key={index} value={value}>
                  {value === originalData?.length && !cloudPagination ? "All" : value}
                </option>
              ))}
            </select>
            Items per page
          </div>
        </>
      )}

      <div>Total Rows: {cloudPagination ? pageNavigator?.totalRows : data?.length}</div>
      <div>Total Columns: {columnsheader?.length}</div>
    </div>
  );
};

export default PaginationComp;
