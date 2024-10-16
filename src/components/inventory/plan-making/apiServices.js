import { useState, useEffect } from 'react';
import { baseUrl } from '../../../utils/config';

export const usePageDetail = (id) => {
  const [pageDetail, setPageDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPageDetail = async () => {
    try {
      const response = await fetch(
        `${baseUrl}v1/plan_page_details_with_planxid/${id}`
      );
      if (!response.ok) throw new Error('Failed to fetch page details');
      const json = await response.json();
      setPageDetail(json?.data);
    } catch (err) {
      console.error('Error fetching page details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageDetail();
  }, []);

  return { pageDetail, loading, error };
};

export const useSendPlanDetails = (id) => {
  const [planSuccess, setPlanSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPlanDetails = async (updatedPlanDetails) => {
    const payload = {
      planx_id: id,
      plan_pages: updatedPlanDetails,
    };

    try {
      setLoading(true); // Start loading state
      const response = await fetch(`${baseUrl}v1/add_multiple_plan_page_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPlanSuccess(data);
    } catch (error) {
      console.error('Error calling the API:', error);
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return { sendPlanDetails, planSuccess, loading, error };
};

export const useFetchPlanDetails = (id) => {
  const [planDetails, setPlanDetails] = useState(null);

  const fetchPlanDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}v1/planxlogs/${id}`);
      const json = await response.json();
      if (json.success) {
        setPlanDetails(json.data);
      } else {
        console.error('Failed to fetch plan details:', json.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching plan details:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlanDetails(); // Fetch when id changes
    }
  }, [id]);

  return { planDetails };
};
