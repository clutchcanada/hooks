import useWindowResize from "./index";

jest.useFakeTimers();

describe("useWindowResize", () => {
  it('should call setState on window resize', () => {
    const setStateMock = jest.fn();
    useWindowResize({
      useStateDep: global.useStateMock({ setStateMock }),
      useEffectDep: (fn) => fn(),
    });
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    
    jest.runAllTimers();

    expect(setStateMock).toBeCalledWith(500);
  });

  it('should call setState on window resize without debounce', () => {
    const setStateMock = jest.fn();
    useWindowResize({
      useStateDep: global.useStateMock({ setStateMock }),
      useEffectDep: (fn) => fn(),
      debounce: false
    });
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    expect(setStateMock).toBeCalledWith(500);
  });
});