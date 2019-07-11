
import useWindowResize from "./index";

describe("useWindowResize", () => {
  it('should call setState on window resize', () => {
    const setStateMock = jest.fn();
    useWindowResize({
      useStateDep: global.useStateMock({ setStateMock }),
      useEffectDep: (fn) => fn(),
    });
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    expect(setStateMock).toBeCalledWith(500);
  });
});