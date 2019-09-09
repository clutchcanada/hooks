import { useState } from  "react";

import useDebounce from "./index";

describe("useDebounce", () => {
  it('should debounce the state update by the specified delay', (done) => {
    let exampleState;
    let debouncedState;
    global.testHook(() => {
      exampleState = useState(0);
      debouncedState = useDebounce({
        value: exampleState[0],
        delay: 500,
      })
    });
    global.act(() => {
      exampleState[1](5)
    });
    expect(debouncedState).toBe(0);
    setTimeout(() => {
      expect(debouncedState).toBe(0);
      done()
    }, 400);
    setTimeout(() => {
      expect(debouncedState).toBe(5);
      done()
    }, 500);
  });
  
});