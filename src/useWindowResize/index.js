import { useEffect, useState, useRef } from 'react';

const useWindowResize = ({
  useStateDep = useState,
  useEffectDep = useEffect,
  useRefDep = useRef,
  debounce = true,
} = {}) => {
  const [windowWidth, setWindowWidth] = useStateDep(window.innerWidth);
  const timeoutRef = useRefDep();

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const debouncedUpdateWindowWidth = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    const timeout = setTimeout(() => {
      updateWindowWidth();
    }, 400);
    timeoutRef.current = timeout;
  }

  useEffectDep(() => {
    window.addEventListener('resize', debounce ? debouncedUpdateWindowWidth : updateWindowWidth);
    return () => {
      window.removeEventListener('resize', debounce ? debouncedUpdateWindowWidth : updateWindowWidth);
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    windowWidth,
  };
};

export default useWindowResize;
