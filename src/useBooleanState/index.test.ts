import { useBooleanState } from './index';

describe('useBooleanState Hook', () => {
  describe('Initialisation', () => {
    const useStateMock = global.useStateMock();

    it('should call useState with the initialState param', () => {
      useStateMock.mockClear();
      useBooleanState({ initialState: true, useStateDep: useStateMock });

      expect(useStateMock).toBeCalledWith(true);
    });

    it('should throw an error if the initial state param is not a boolean value', () => {
      useStateMock.mockClear();
      const test = () => {
        useBooleanState({ initialState: 'hey', useStateDep: useStateMock });
      };
      expect(test).toThrowError();
    });

    it('should return the initial stateValue in the return object', () => {
      useStateMock.mockClear();
      const { value: isOpen1 } = useBooleanState({
        initialState: true,
        useStateDep: useStateMock,
      });

      expect(isOpen1).toBe(true);

      useStateMock.mockClear();
      const { value: isOpen2 } = useBooleanState({ useStateDep: useStateMock });

      expect(isOpen2).toBe(false);
    });
  });

  describe('toggle function', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    it('should call setState with flipped value of state', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();
      const { value: isOpen1, toggle: toggleModal1 } = useBooleanState({
        initialState: true,
        useStateDep: useStateMock,
      });

      toggleModal1();

      expect(setStateMock).toBeCalledWith(!isOpen1);

      setStateMock.mockClear();
      useStateMock.mockClear();
      const { value: isOpen2, toggle: toggleModal2 } = useBooleanState({
        useStateDep: useStateMock,
      });

      toggleModal2();

      expect(setStateMock).toBeCalledWith(!isOpen2);
    });
  });

  describe('setTrue', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });
    it('should call setSate with true', () => {
      const { setTrue } = useBooleanState({
        initialState: true,
        useStateDep: useStateMock,
      });
      setTrue();
      expect(setStateMock).toBeCalledWith(true);
    });
  });

  describe('setFalse', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });
    it('should call setSate with true', () => {
      const { setFalse } = useBooleanState({
        initialState: true,
        useStateDep: useStateMock,
      });
      setFalse();
      expect(setStateMock).toBeCalledWith(false);
    });
  });

  describe('setState', () => {
    it('should throw an error if a non-boolean value is passed', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      const test = () => {
        booleanState.setState('clearly a boolean');
      };
      expect(test).toThrowError();
    });
    it('should set the state if a valid boolean is passed', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      global.act(() => {
        booleanState.setState(true);
      });
      expect(booleanState.value).toBe(true);
    });
  });
});
