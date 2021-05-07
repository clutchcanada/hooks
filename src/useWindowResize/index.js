import { useEffect, useState } from 'react';

const useWindowResize = ({
  useStateDep = useState,
  useEffectDep = useEffect,
  debounce = true,
} = {}) => {
  const [windowWidth, setWindowWidth] = useStateDep(window.innerWidth);
  const [timeoutState, setTimeoutState] = useStateDep();

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const debouncedUpdateWindowWidth = () => {
    const timeout = setTimeout(() => {
      updateWindowWidth();
    }, 400);
    setTimeoutState(timeout);
  }

  useEffectDep(() => {
    window.addEventListener('resize', debounce ? debouncedUpdateWindowWidth : updateWindowWidth);
    return () => {
      window.removeEventListener('resize', debounce ? debouncedUpdateWindowWidth : updateWindowWidth);
      clearTimeout(timeoutState);
    }
  }, []);

  return {
    windowWidth,
  };
};

export default useWindowResize;
