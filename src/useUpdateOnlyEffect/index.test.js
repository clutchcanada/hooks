import { useState } from "react";
import useUpdateOnlyEffect from "./index";

describe("useUpdateOnlyEffect", () => {
  it('should not make the function call on mount', () => {
    const mockFunction = jest.fn();
    global.testHook(() => {
      useUpdateOnlyEffect(() => {
        mockFunction();
      }, []);
    });

    expect(mockFunction).not.toHaveBeenCalled();
  });


  it('should not make the function call on mount', () => {
    const mockFunction = jest.fn();
    let randomState;

    global.testHook(() => {
      randomState = useState(0);
      useUpdateOnlyEffect(() => {
        mockFunction();
      }, [randomState[0]]);
    });

    global.act(() => {
      randomState[1](1);
    });

    expect(mockFunction).toHaveBeenCalled();
  });
  
});