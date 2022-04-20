import { useEventListener } from './index';

describe('useEventListener', () => {
  it('should have an initial call count set to 0', () => {
    const myEventListener = useEventListener({
      useStateDep: global.useStateMock(),
    });
    expect(myEventListener.callCount).toBe(0);
  });

  it('should call setState with 1 on trigger call', () => {
    const setStateMock = jest.fn();
    const myEventListener = useEventListener({
      useStateDep: global.useStateMock({ setStateMock }),
    });
    myEventListener.trigger();
    const calledWith = setStateMock.mock.calls[0][0](0);
    expect(calledWith).toBe(1);
  });

  it('should reset callCount to 0 on reset', () => {
    let useEventListenerState;
    global.testHook(() => {
      useEventListenerState = useEventListener();
    });

    global.act(() => {
      useEventListenerState.trigger();
    });

    expect(useEventListenerState.callCount).toBe(1);

    global.act(() => {
      useEventListenerState.reset();
    });

    expect(useEventListenerState.callCount).toBe(0);
  });
});
