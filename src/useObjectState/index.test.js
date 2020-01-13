import useObjectState from './index';

describe('useObjectState', () => {
  const coolObject = { nice: 69, blazeIt: 420 };
  const testUseObjectState = initialState => {
    let objectStateHook;
    global.testHook(() => {
      objectStateHook = useObjectState(initialState);
    });
    return objectStateHook;
  };

  describe('Initialisation', () => {
    it('should return the initial state value in the return object', () => {
      const objectStateHook = testUseObjectState(coolObject);
      expect(objectStateHook.value).toStrictEqual(coolObject);
    });

    it('should default to an empty object for the initial state if none is given', () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState();
      });
      expect(objectStateHook.value).toStrictEqual({});
    });
  });

  describe('updateOne function', () => {
    it('should add the given property and value to the state if not present already', () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState(coolObject);
      });
      global.act(() => {
        objectStateHook.updateOne('dewIt')(66);
      });
      expect(objectStateHook.value).toStrictEqual({
        nice: 69,
        blazeIt: 420,
        dewIt: 66,
      });
    });

    it('should update the given property if already present', () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState(coolObject);
      });
      global.act(() => {
        objectStateHook.updateOne('nice')(109);
      });
      expect(objectStateHook.value).toStrictEqual({
        nice: 109,
        blazeIt: 420,
      });
    });
  });

  describe('update function', () => {
    it("should merge its argument's properties into the state", () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState(coolObject);
      });
      global.act(() => {
        objectStateHook.update({ newProperty: 1337, nice: 109 });
      });
      expect(objectStateHook.value).toStrictEqual({
        nice: 109,
        blazeIt: 420,
        newProperty: 1337,
      });
    });
  });

  describe('reset function', () => {
    it('should set the state to its argument', () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState(coolObject);
      });
      const newState = { newProperty: 1337, nice: 109 };
      global.act(() => {
        objectStateHook.reset(newState);
      });
      expect(objectStateHook.value).toStrictEqual(newState);
    });

    it('should default to the initial state if no argument is given', () => {
      let objectStateHook;
      global.testHook(() => {
        objectStateHook = useObjectState(coolObject);
      });
      global.act(() => {
        objectStateHook.update({ hey: 'the state has been changed' });
      });
      expect(objectStateHook.value).not.toStrictEqual(coolObject);
      global.act(() => {
        objectStateHook.reset();
      });
      expect(objectStateHook.value).toStrictEqual(coolObject);
    });
  });
});
