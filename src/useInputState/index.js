import { useState, useEffect } from 'react';

export const useInputState = ({
  sideEffects = [],
  initialValue = '',
  useStateDep = useState,
  useEffectDep = useEffect,
} = {}) => {
  const [stateValue, setStateValue] = useStateDep(initialValue);

  useEffectDep(() => {
    sideEffects.forEach(fn => fn(initialValue));
  }, []);

  const handleChange = event => {
    const { value } = event.target;
    sideEffects.forEach(fn => fn(value));
    setStateValue(value);
    return event;
  };

  const resetValue = () => {
    setStateValue(initialValue);
  };

  return {
    stateValue,
    handleChange,
    resetValue,
    setStateValue,
  };
};

export default useInputState;
