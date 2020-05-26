import { useState } from "react";
import useInterval from "./index";

describe("useIntervalHook", () => {
  it('should set up an interval if delay is passed', (done) => {
    const intervalMock  = jest.fn();
    global.testHook(() => {
      useInterval(intervalMock, 100);
    });
    setTimeout(() => {
      expect(intervalMock).toBeCalled();
      done();
    }, 200);
  });

  it('should not set up an interval if null is passed as a delay', (done) => {
    const intervalMock  = jest.fn();
    global.testHook(() => {
      useInterval(intervalMock, null);
    });
    setTimeout(() => {
      expect(intervalMock).not.toBeCalled();
      done();
    }, 200);
  });

  it('should use the latest state', (done) => {
    const intervalMock  = jest.fn();
    let testState;
    global.testHook(() => {
      testState = useState(0);
      useInterval(() => {
        intervalMock(testState[0]);
      }, 100);
    });
    global.act(() => {
      testState[1](1);
    });
    setTimeout(() => {
      expect(intervalMock).toBeCalledWith(1);
      done();
    }, 200);
  });
  
});