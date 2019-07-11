import { useState, useEffect } from 'react';

const useScrollPosition = ({
  useStateDep = useState,
  useEffectDep = useEffect,
} = {}) => {
  const [scrollPosition, setScrollPosition] = useStateDep(window.scrollY);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };
  useEffectDep(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    scrollPosition,
  };
};

export default useScrollPosition;
