import { useEffect, useState } from 'react';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { baseUrl } from '../../../../utils/config';

const VendorDocCount = ({ documents, setVendorDocsCountData }) => {
  const [documentCount, setDocumentCount] = useState('');

  const fetchVendorCounts = async () => {
    try {
      const response = await fetch(`${baseUrl}v1/count_documents/${documentCount}`);
      const json = await response.json();
      if (json.success) {
        setVendorDocsCountData(json.data.vendors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (documentCount) {
      fetchVendorCounts();
    }
  }, [documentCount]);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Vendors with Document Counts</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {documents?.map((item, index) => (
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12" key={index}>
                <div className="card">
                  <div className="card-body text-center">
                    <div className="iconBadge small bgPrimaryLight">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="text-primary mb-2 ">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setDocumentCount(item.documentCountKey)}>
                          Document {item?.documentCount === 'morethan3' ? '3+' : item.documentCount}: {item.vendorCount}
                        </button>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDocCount;
