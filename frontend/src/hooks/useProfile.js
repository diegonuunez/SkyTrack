import { useState, useEffect } from 'react';
import { getMyProfile } from '../services/userService';

export const useProfile = (token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getMyProfile(token);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchUser();
  }, [token]);

  return { data, loading, error };
};