import { useState, useEffect } from 'react';

// Code is based on this article: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci

type DebounceInitialState<T> = {
  value: T;
  delay: number;
};

export const useDebounce = <T>({ value, delay }: DebounceInitialState<T>) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};
