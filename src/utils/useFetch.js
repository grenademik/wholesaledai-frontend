import { useState, useEffect } from 'react';
import { get } from '../api';

const useFetch = (apiUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(apiUrl);
                console.log(response)
                if (response) {
                    console.log(response)
                    setData(response);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiUrl]);

    return { data, loading, error };
};

export default useFetch;