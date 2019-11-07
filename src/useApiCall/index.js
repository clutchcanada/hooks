import { useState, useEffect } from 'react';
import axios from "axios";
import { throwError } from "@clutch/helpers";
import useBooleanState from "../useBooleanState";
import * as R from 'ramda';

const CancelToken = axios.CancelToken;

const useApiCall = ({
  apiCallFn,
  onError = (error) => { throw error },
  onSuccess = () => {},
  useStateDep = useState,
  useEffectDep = useEffect,
} = {}) => {
  R.isNil(apiCallFn) && throwError("No api call fn specified in useApiCall");
  const isLoadingState = useBooleanState({ useStateDep });
  const [axiosCancelTokenState, setAxiosCancelTokenState] = useState(null);

  useEffectDep(() => {
    const source = CancelToken.source();
    setAxiosCancelTokenState(axiosCancelTokenState);
  }, []);

  const makeCall = async (...args) => {
    try {
      isLoadingState.setTrue();
      const response = await apiCallFn(...args);
      isLoadingState.setFalse();
      onSuccess({ response, payload: args });
      return response;
    } catch (error) {
      isLoadingState.setFalse();
      if (!axios.isCancel()) {
        onError({ error, payload: args });
      }
      return null;
    }
  };

  const cancelCall = () => {
    isLoadingState.value && 
    !!axiosCancelTokenState &&
    axiosCancelTokenState.cancel();
  }

  return {
    isLoading: isLoadingState.value,
    makeCall,
    cancelCall,
  };
};

export default useApiCall;
