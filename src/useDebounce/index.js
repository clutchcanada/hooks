import React, { useState, useEffect } from "react";

// Code is based on this article: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci

const useDebounce = ({ value, delay }) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  },[value]);

  return debouncedValue;
}

export default useDebounce;