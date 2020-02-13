import useBooleanState from './index';

describe('useBooleanState Hook', () => {
  describe('Initialisation', () => {
    it('should call useState with the initialState param', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      expect(booleanState.value).toBe(false);
    });

    it('should throw an error if the initial state param is not a boolean value', () => {
      const test = () => {
        useBooleanState({ initialState: 'hey' });
      };
      expect(test).toThrowError();
    });

    it('should return the initial stateValue in the return object', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState({
          initialState: true,
        });
      });
      expect(booleanState.value).toBe(true);
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      expect(booleanState.value).toBe(false);
    });
  });

  describe('toggle function', () => {
    it('should call setState with flipped value of state', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      global.act(() => {
        booleanState.toggle();
      });
      expect(booleanState.value).toBe(true);
      global.act(() => {
        booleanState.toggle();
      });
      expect(booleanState.value).toBe(false);
    });
  });

  describe('setTrue', () => {
    it('should call setSate with true', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      global.act(() => {
        booleanState.setTrue();
      });
      expect(booleanState.value).toBe(true);
    });
  });

  describe('setFalse', () => {
    it('should call setSate with false', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState({
          initialState: true,
        });
      });
      global.act(() => {
        booleanState.setFalse();
      });
      expect(booleanState.value).toBe(false);
    });
  });

  describe('setState', () => {
    it('should call setState when setState method is invoked', () => {
      let booleanState;
      global.testHook(() => {
        booleanState = useBooleanState();
      });
      global.act(() => {
        booleanState.setState(true);
      });
      expect(booleanState.value).toBe(true);
    })
  })
});
