import { useState } from 'react';
import { throwError } from "@clutch/helpers";
import useBooleanState from "../useBooleanState";
import * as R from 'ramda';

const useApiCall = ({
  apiCallFn,
  onError = (error) => { throw error },
  useStateDep = useState,
}) => {
  R.isNil(apiCallFn) && throwError("No api call fn specified in useApiCall");
  const isLoadingState = useBooleanState({ useStateDep });

  const makeCall = async (...args) => {
    try {
      isLoadingState.setTrue();
      const response = await apiCallFn(...args);
      isLoadingState.setFalse();
      return R.prop('data', response);
    } catch (error) {
      isLoadingState.setFalse();
      onError(error);
      return null;
    }

  };

  return {
    isLoading: isLoadingState.value,
    makeCall,
  };
};

export default useApiCall;
