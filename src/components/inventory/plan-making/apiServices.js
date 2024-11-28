import { useState, useEffect } from 'react';
import { baseUrl } from '../../../utils/config';
import { useSelector } from 'react-redux';

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

  // const planStatus = useSelector((state) => state.pageMaster.planStatus);

  const sendPlanDetails = async (updatedPlanDetails, planStatus) => {
    const payload = {
      planx_id: id,
      plan_pages: updatedPlanDetails,
      plan_status: planStatus === 'close' ? 'saved' : '',
    };
    try {
      setLoading(true); // Start loading state
      const response = await fetch(
        `${baseUrl}v1/add_multiple_plan_page_data_v2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

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
      fetchPlanDetails();
    }
  }, [id]);

  return { planDetails };
};

export const useFetchPlanDescription = () => {
  const [descriptions, setDescriptions] = useState(['Sssss']);

  const fetchDescriptions = async () => {
    try {
      const response = await fetch(`${baseUrl}v1/planxnote`);
      if (response.ok) {
        const data = await response.json();
        setDescriptions(data?.data);
      } else {
        console.error('Failed to fetch descriptions');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchDescriptions();
  }, []);

  return { descriptions };
};

export const usePlanPagesVersionDetails = (id) => {
  const [versionDetails, setVersionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVersionDetails = async () => {
    try {
      const response = await fetch(
        `${baseUrl}v1/get_plan_pages_version_details/${id}`
      );
      if (!response.ok) throw new Error('Failed to fetch version details');
      const data = await response.json();
      setVersionDetails(data?.data);
    } catch (err) {
      console.error('Error fetching version details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVersionDetails();
    }
  }, [id]);

  return { versionDetails, loading, error };
};

// Named export for the custom hook
export const useGetPlanPages = (id, version) => {
  const [versionData, setVersionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !version) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}v1/get_plan_pages_by_id_version/?planx_id=${id}&version=${version}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setVersionData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, version]);

  return { versionData, loading, error };
};
