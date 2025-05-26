import { useEffect, useState } from "react";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { baseUrl } from "../../../../utils/config";

const VendorDocCount = ({ documents, setVendorDocsCountData }) => {
  const [documentCounts, setDocumentCounts] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // 🔹 For storing clicked type
  const token = sessionStorage.getItem("token");

  const fetchVendorCounts = async (type = "") => {
    try {
      const response = await fetch(
        `${baseUrl}v1/get_vendor_document_count${type ? `?type=${type}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data?.data?.documentCount[0], "Document Count");

      const counts = data?.data?.documentCount?.[0];

      if (counts) {
        const transformed = Object.entries(counts).map(([key, value]) => ({
          label: key,
          count: value,
        }));
        setDocumentCounts(transformed);
        setVendorDocsCountData(data.data.vendorData);
      }
    } catch (error) {
      console.error("Error fetching vendor counts:", error);
    }
  };

  useEffect(() => {
    fetchVendorCounts(); // Initial load without any type filter
  }, []);

  const handleCardClick = (label) => {
    setSelectedType(label); // Save selected type
    fetchVendorCounts(label); // Fetch data with query param
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Vendors with Document Counts</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {documentCounts.map((item, index) => (
              <div
                className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12"
                key={index}
              >
                <div className="card">
                  <div className="card-body text-center">
                    <div className="iconBadge small bgPrimaryLight">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="text-primary mb-2">
                        <button
                          className={`btn btn-sm ${
                            selectedType === item.label
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => handleCardClick(item.label)}
                        >
                          {item.label}: {item.count}
                        </button>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {documentCounts.length === 0 && (
              <div className="col-12 text-center">
                <p>No document data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDocCount;
