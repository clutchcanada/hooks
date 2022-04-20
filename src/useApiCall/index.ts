import axios from 'axios';
import * as R from 'ramda';
import { useState } from 'react';
import { throwError } from '@clutch/helpers';
import { useBooleanState } from '../useBooleanState';

type AnyFunction = (...args: any[]) => any;

type ApiCallInitialState<T extends AnyFunction> = {
  apiCallFn: T;
  onError?: (error: any) => any;
  onSuccess?: (args: { response: any; payload: any }) => void;
  useStateDep?: typeof useState;
};

const useApiCall = <T extends AnyFunction>({
  apiCallFn,
  onError = (error) => {
    throw error;
  },
  onSuccess = () => {},
  useStateDep = useState,
}: ApiCallInitialState<T>) => {
  R.isNil(apiCallFn) && throwError('No api call fn specified in useApiCall');
  const isLoadingState = useBooleanState({ useStateDep });

  const makeCall = async (
    ...args: Parameters<T>
  ): Promise<ReturnType<T> | null> => {
    try {
      isLoadingState.setTrue();
      const response = await apiCallFn(...args);
      isLoadingState.setFalse();
      onSuccess({ response, payload: args });
      return response;
    } catch (error) {
      isLoadingState.setFalse();
      if (!axios.isCancel(error)) {
        onError({ error, payload: args });
      }
      return null;
    }
  };

  return {
    isLoading: isLoadingState.value,
    makeCall,
  };
};

export default useApiCall;
