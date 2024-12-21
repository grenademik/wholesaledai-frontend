function convertToQueryParams(obj) {
    const queryParams = Object.entries(obj)
        .filter(([_, value]) => value != null) // Filter out null or undefined values
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                // If the value is an array, create multiple query parameters for each element in the array
                return value.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            } else if (typeof value === 'string' && value.includes(',')) {
                // If the value is a string containing commas, split it and create multiple query parameters
                const values = value.split(',');
                return values.map(val => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            } else {
                // If the value is not an array or a string with commas, create a single query parameter
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        })
        .join('&');
    return queryParams ? `?${queryParams}` : '';
}

export default convertToQueryParams;