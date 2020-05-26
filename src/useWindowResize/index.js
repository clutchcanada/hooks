import { useEffect, useState } from 'react';

const useWindowResize = ({
  useStateDep = useState,
  useEffectDep = useEffect,
  debounce = 0,
} = {}) => {
  const [windowWidth, setWindowWidth] = useStateDep(window.innerWidth);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  },[value]);

  const updateWindowWidth = setTimeout(() => {
      setWindowWidth(value);
    }, delay);
  useEffectDep(() => {
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  return {
    windowWidth,
  };
};

export default useWindowResize;
