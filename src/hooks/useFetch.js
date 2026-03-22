import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook for data fetching with loading and error states.
 * Re-fetches automatically when the URL changes.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const { data: responseData } = await axios.get(url);
      setData(responseData);
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Rate limit reached. Please wait a moment and try again.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
