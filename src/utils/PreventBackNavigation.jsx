import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PreventBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [historyStack, setHistoryStack] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [lastPopState, setLastPopState] = useState(null);

  useEffect(() => {
    // Push the initial route to the stack
    setHistoryStack((prev) => [...prev, location.pathname]);
  }, []);

  useEffect(() => {
    const handleBackNavigation = (event) => {
      event.preventDefault();
      setLastPopState(location.pathname);
      setShowPopup(true);
    };

    window.addEventListener("popstate", handleBackNavigation);
    return () => {
      window.removeEventListener("popstate", handleBackNavigation);
    };
  }, [location]);

  const handleConfirmBack = () => {
    setShowPopup(false);
    setHistoryStack((prev) => prev.slice(0, -1)); // Remove last route
    window.history.back(); // Proceed with the back action
  };

  const handleCancelBack = () => {
    setShowPopup(false);
    navigate(location.pathname, { replace: true }); // Stay on the page
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-bold">Do you really want to go back?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleCancelBack} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleConfirmBack} className="px-4 py-2 bg-red-500 text-white rounded">
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreventBackNavigation;
