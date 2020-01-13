import { useState } from 'react';
import * as R from 'ramda';

const useObjectState = (initialState = {}) => {
  const [state, setState] = useState(initialState);

  const update = R.pipe(R.mergeLeft, setState);

  const updateOne = R.curry((key, value) => update({ [key]: value }));

  const reset = (value = initialState) => setState(value);

  return {
    value: state,
    update,
    updateOne,
    reset,
    setState,
  };
};

export default useObjectState;
