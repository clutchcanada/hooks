
import useScrollPosition from "./index";

describe("useScrollPosition", () => {
  it('should call setState on window scroll', () => {
    const setStateMock = jest.fn();
    useScrollPosition({
      useStateDep: global.useStateMock({ setStateMock }),
      useEffectDep: (fn) => fn()
    });
    global.scrollY = 700;
    global.dispatchEvent(new Event('scroll'));

    expect(setStateMock).toBeCalledWith(700);
  });
});