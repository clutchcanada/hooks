import { useEffect, useState } from 'react';

const useWindowResize = ({
  useStateDep = useState,
  useEffectDep = useEffect,
} = {}) => {
  const [windowWidth, setWindowWidth] = useStateDep(window.innerWidth);

  const updateWindowWidth = () => {	
    setWindowWidth(window.innerWidth);
  };
  useEffectDep(() => {
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  return {
    windowWidth,
  };
};

export default useWindowResize;
