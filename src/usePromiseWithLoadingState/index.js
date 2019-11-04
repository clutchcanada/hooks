import { throwError } from "@clutch/helpers";

import useBooleanState from "../useBooleanState";

const usePromiseWithLoadingState = (promise) => {
    !promise && throwError("No promise specified in usePromiseWithLoadingState");
    const isLoadingState = useBooleanState({ initialState: true });
  
    const wrappedPromise = async() => {
      try {
       const result =  await promise;
       return result;
      } catch (error) {
        throw error;
      } finally {
        isLoadingState.setFalse();
      }
    }
  
    return {
      isLoading: isLoadingState.value,
      promise: wrappedPromise(),
    }
}

export default usePromiseWithLoadingState;