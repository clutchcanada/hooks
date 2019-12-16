import useKeyPress from './index';

describe('useKeyPress Hook', () => {
    //TO-DO: Add tests for key 
  describe('Initialisation', () => {
    it('should throw an error if the targetKey is not a string', () => {
      const test = () => {
        useKeyPress(123);
      };
      expect(test).toThrowError();
    });

    it('should set initial key pressed value as false', () => {
        let keyPressValue;
        global.testHook(() => {
            keyPressValue = useKeyPress('12');
        });

        expect(keyPressValue).toBe(false);
    });
  });
});
