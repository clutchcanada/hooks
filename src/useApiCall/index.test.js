import useApiCall from "./index";

describe("useApiCall", () => {

  it('should make the api call on make call', () => {
    const useStateMock = global.useStateMock();
    const mockApiCall = jest.fn(() => Promise.resolve());

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock
    });

    apiCallState.makeCall();

    expect(mockApiCall).toBeCalled();
  });

  it('should pass the arguments to the api call', () => {
    const useStateMock = global.useStateMock();
    const mockApiCall = jest.fn(() => Promise.resolve());

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock
    });

    apiCallState.makeCall("test");

    expect(mockApiCall).toBeCalledWith("test");
  });

  it('should error if no api call specified', () => {
    const useStateMock = global.useStateMock();

    const test = () => {
      const apiCallState  = useApiCall({
        useStateDep: useStateMock
      });
    };

    expect(test).toThrow();
  });

  it('should throw any error from the api by default', () => {
    const useStateMock = global.useStateMock();
    const error = new Error("test");
    const mockApiCall = () => Promise.reject(error);

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock
    });

    const test = async () => apiCallState.makeCall("test");
    
    expect(test()).rejects.toEqual(error);
  });

  it('should call error callback on error', (done) => {
    const useStateMock = global.useStateMock();
    const error = new Error("test");
    const mockApiCall = () => Promise.reject(error);
    const errorCallback = jest.fn();

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock,
      onError: errorCallback
    });

    const test = async () => {
      await apiCallState.makeCall("test");
      expect(errorCallback).toBeCalled();
      done();
    };
    test();
  });
  
  it('should call useState with true on makeCall', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });
    const mockApiCall = jest.fn(() => Promise.resolve());

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock
    });
    setStateMock.mockClear();
    apiCallState.makeCall();

    expect(setStateMock).toBeCalledWith(true);
  });

  it('should call useState with false on makeCall finish', (done) => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });
    const mockApiCall = jest.fn(() => Promise.resolve());

    const apiCallState  = useApiCall({
      apiCallFn: mockApiCall,
      useStateDep: useStateMock
    });

    const test = async () => {
      setStateMock.mockClear();
      await apiCallState.makeCall("test");
      expect(setStateMock).toBeCalledWith(false);
      done();
    };
    test();
  });
});