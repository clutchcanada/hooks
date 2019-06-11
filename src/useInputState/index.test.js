import useInputState from './index';

describe('UseInputState Hook', () => {
  const mockUseEffect = jest.fn();

  describe('Initialization', () => {
    const mockUseState = global.useStateMock();

    it('should call useState with the initialValue', () => {
      mockUseState.mockClear();
      const initialValue = 5;
      useInputState({ initialValue, useStateDep: mockUseState, useEffectDep: mockUseEffect });

      expect(mockUseState).toBeCalledWith(initialValue);
    });

    it('should return the initial stateValue in the return object', () => {
      const initialValue = 'hello world';
      const { stateValue } = useInputState({
        initialValue,
        useStateDep: mockUseState,
        useEffectDep: mockUseEffect,
      });

      expect(stateValue).toEqual(initialValue);
    });
  });

  describe('handleChange', () => {
    const mockSetStateValue = jest.fn();
    const mockUseState = jest.fn(initialValue => {
      const _value = initialValue;
      const setStateValue = mockSetStateValue;
      return [_value, setStateValue];
    });

    it('should call tge setStateValue with event.target.value', () => {
      mockSetStateValue.mockClear();
      mockUseState.mockClear();
      const mockEvent = {
        target: {
          value: 'George Orwell',
        },
      };

      const { handleChange } = useInputState({
        initialValue: 'yolo',
        useStateDep: mockUseState,
        useEffectDep: mockUseEffect
      });

      handleChange(mockEvent);

      expect(mockSetStateValue).toBeCalledWith(mockEvent.target.value);
    });

    it('should call all the sideEffect functions passed to useInputState with the value in the event', () => {
      const mockEvent = {
        target: {
          value: 'George Orwell',
        },
      };
      const mockSideEffect = jest.fn();
      const mockSideEffect2 = jest.fn();

      const { handleChange } = useInputState({
        initialValue: 'yolo',
        useStateDep: mockUseState,
        sideEffects: [mockSideEffect, mockSideEffect2],
        useEffectDep: mockUseEffect
      });

      handleChange(mockEvent);

      expect(mockSideEffect).toBeCalledWith(mockEvent.target.value);
      expect(mockSideEffect2).toBeCalledWith(mockEvent.target.value);
    });
  });

  describe('resetValue function', () => {
    const mockSetStateValue = jest.fn();
    const mockUseState = jest.fn(initialValue => {
      const _value = initialValue;
      const setStateValue = mockSetStateValue;
      return [_value, setStateValue];
    });

    it('should call setStateValue with the initial value passed to useInputState', () => {
      const initialValue = 'Thats Clutch';

      const { resetValue } = useInputState({
        initialValue,
        useStateDep: mockUseState,
        useEffectDep: mockUseEffect
      });
      resetValue();
      expect(mockSetStateValue).toBeCalledWith(initialValue);
    });
  });
});
