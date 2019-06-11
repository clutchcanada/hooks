import { useState } from 'react';
import * as R from 'ramda';
import { throwError } from '@clutch/helpers';

export const useBooleanState = ({
  initialState = false,
  useStateDep = useState,
} = {}) => {
  if (typeof initialState !== 'boolean')
    throwError('Boolean state must be a boolean value');
  const [value, setBooleanState] = useStateDep(initialState);

  const toggle = () => setBooleanState(!value);
  const setTrue = () => setBooleanState(true);
  const setFalse = () => setBooleanState(false);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
  };
};

export default useBooleanState;
