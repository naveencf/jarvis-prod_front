import './UnFetchPages.css';

const UnfetchedPages = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fetch-results-overlay">
      <div className="fetch-results-content">
        <h3>Fetch Results</h3>
        <p>
          <strong>Total Fetched Pages:</strong> {data?.totalFetchedPagesCount}
        </p>
        <p>
          <strong>Pages Not Found: {data?.notFoundPages?.length}</strong>
        </p>
        {data?.notFoundPages?.length > 0 ? (
          <ul className='fetch-result-list'>
            {data?.notFoundPages?.map((page, index) => (
              <li key={index}>{page}</li>
            ))}
          </ul>
        ) : (
          <p>All pages were successfully fetched!</p>
        )}
        <button className="fetch-results-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UnfetchedPages;
