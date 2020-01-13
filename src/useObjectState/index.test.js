import useObjectState from './index';

describe('useObjectState', () => {
  const coolObject = { nice: 69, blazeIt: 420 };

  describe('Initialisation', () => {
    const useStateMock = global.useStateMock();

    it('should call useState with its argument', () => {
      useStateMock.mockClear();
      useObjectState({ initialState: coolObject, useStateDep: useStateMock });

      expect(useStateMock).toBeCalledWith(coolObject);
    });

    it('should return the initial state value in the return object', () => {
      useStateMock.mockClear();
      const { value: objectState1 } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });

      expect(objectState1).toStrictEqual(coolObject);

      useStateMock.mockClear();
      const { value: objectState2 } = useObjectState({
        useStateDep: useStateMock,
      });

      expect(objectState2).toStrictEqual({});
    });
  });

  describe('updateOne function', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    it('should add the given property and value to the state if not present already', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { updateOne: updateOneProperty } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });
      updateOneProperty('newProperty')(1337);
      expect(setStateMock.mock.calls[0][0]).toStrictEqual({
        nice: 69,
        blazeIt: 420,
        newProperty: 1337,
      });
    });

    it('should update the given property if already present', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { updateOne: updateOneProperty } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });
      updateOneProperty('nice')(109);
      expect(setStateMock.mock.calls[0][0]).toStrictEqual({
        nice: 109,
        blazeIt: 420,
      });
    });
  });

  describe('updateOne function', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    it("should merge its argument's properties into the state", () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { update } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });
      update({ newProperty: 1337, nice: 109 });
      expect(setStateMock.mock.calls[0][0]).toStrictEqual({
        nice: 109,
        blazeIt: 420,
        newProperty: 1337,
      });
    });
  });

  describe('reset function', () => {
    const setStateMock = jest.fn();
    const useStateMock = global.useStateMock({ setStateMock });

    it('should set the state to its argument', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { reset } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });
      const newState = { newProperty: 1337, nice: 109 };
      reset(newState);
      expect(setStateMock.mock.calls[0][0]).toStrictEqual(newState);
    });

    it('should default to the initial state if no argument is given', () => {
      setStateMock.mockClear();
      useStateMock.mockClear();

      const { reset } = useObjectState({
        initialState: coolObject,
        useStateDep: useStateMock,
      });

      reset(coolObject);
      expect(setStateMock.mock.calls[0][0]).toStrictEqual(coolObject);
    });
  });
});
