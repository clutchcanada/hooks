import useAccordionState, { NO_ACTIVE_KEY } from './index';

describe('UseAccordion Hook', () => {
  describe('Initialization', () => {
    const useStateMock = global.useStateMock();

    it('should call useState with the defaultKey', () => {
      useStateMock.mockClear();
      const defaultKey = 5;
      useAccordionState({ defaultKey, useStateDep: useStateMock });

      expect(useStateMock).toBeCalledWith(defaultKey);
    });

    it('should set the defaultKey to NO_ACTIVE_KEY', () => {
      useStateMock.mockClear();
      useAccordionState({ useStateDep: useStateMock });

      expect(useStateMock).toBeCalledWith(NO_ACTIVE_KEY);
    });

    it('should return the initial stateValue in the return object', () => {
      useStateMock.mockClear();
      const defaultKey = 'hello world';
      const { activeKey } = useAccordionState({
        defaultKey,
        useStateDep: useStateMock,
      });

      expect(activeKey).toEqual(defaultKey);
    });
  });

  describe('isActiveKey', () => {
    const useStateMock = global.useStateMock();

    it('should return true if the state currently holds that key', () => {
      useStateMock.mockClear();
      const defaultKey = 'hello world';
      const { isActiveKey } = useAccordionState({
        defaultKey,
        useStateDep: useStateMock,
      });
      expect(isActiveKey(defaultKey)).toBe(true);
    });

    it('should return false if the state currently does not hold that key', () => {
      useStateMock.mockClear();
      const defaultKey = 'hello world';
      const { isActiveKey } = useAccordionState({
        defaultKey,
        useStateDep: useStateMock,
      });
      expect(isActiveKey('Not this key')).toBe(false);
    });
  });

  describe('togglePanel', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    it('should throw error if key is not in list of keys passed at initialization', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { togglePanel } = useAccordionState({
        keys: [],
        useStateDep: useStateMock,
      });

      const test = () => {
        togglePanel('Rando key');
      };

      expect(test).toThrowError();
    });

    it('should call setState with the key if the key is not already in state', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const testKeys = ['yolo', 'hey bruh'];
      const { togglePanel } = useAccordionState({
        keys: testKeys,
        useStateDep: useStateMock,
        defaultKey: testKeys[0],
      });

      togglePanel(testKeys[1]);

      expect(setStateMock).toBeCalledWith(testKeys[1]);
    });

    it('should call setState with the NO_ACTIVE_KEY value if the key is already in state', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const testKeys = ['yolo', 'hey bruh'];
      const { togglePanel } = useAccordionState({
        keys: testKeys,
        useStateDep: useStateMock,
        defaultKey: testKeys[0],
      });

      togglePanel(testKeys[0]);

      expect(setStateMock).toBeCalledWith(NO_ACTIVE_KEY);
    });
  });
});
