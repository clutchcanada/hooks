import { useState } from 'react';
import { throwError } from '@clutch/helpers';

type State = {
  initialState: boolean;
  useStateDep: typeof useState;
};

export const useBooleanState = ({
  initialState = false,
  useStateDep = useState,
}: State) => {
  if (typeof initialState !== 'boolean')
    throwError('Boolean state must be a boolean value');
  const [value, setBoolean] = useStateDep(initialState);

  const toggle = () => setBoolean(!value);
  const setTrue = () => setBoolean(true);
  const setFalse = () => setBoolean(false);

  const setState = (value: boolean) => {
    if (typeof value !== 'boolean')
      throwError('Boolean state must be a boolean value');
    setBoolean(value);
  };

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setState,
  };
};
