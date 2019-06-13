import { addKey } from '@clutch/helpers';
import * as R from "ramda";
import useListState from './index';


describe('useBooleanState Hook', () => {
  const setStateMock = jest.fn();
  const useStateMock = global.useStateMock({ setStateMock });
  beforeEach(() => {
    setStateMock.mockClear();
    useStateMock.mockClear();
  });
  describe('Initialisation', () => {
    it('should call useState with the initialState param', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      useListState({ initialValue: keys, useStateDep: useStateMock });

      expect(useStateMock).toBeCalledWith(keys);
    });

    it('should throw an error if the initial state items do not have a key', () => {
      const test = () => {
        const keys = ['hey', 'buddy'];
        useListState({ initialValue: keys, useStateDep: useStateMock });
      };
      expect(test).toThrowError();
    });

    it('should return the current state via the list state prop', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { listState } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      expect(listState).toEqual(keys);
    });
  });

  describe('addListItem', () => {
    it('should throw an error if item is in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { addListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        addListItem(keys[0]);
      };

      expect(test).toThrowError();
    });

    it('should throw error if item has no key', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { addListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        addListItem({ item: 'hey' });
      };

      expect(test).toThrowError();
    });

    it('should call setState with current listState and new item', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { addListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      addListItem(testItem);
      const calledWith = setStateMock.mock.calls[0][0](keys);
      expect(calledWith).toEqual([...keys, testItem]);
    });

    it('should fire any sideEffects passed', () => {
      const sideEffects = [jest.fn()];
      const keys = ['hey', 'buddy'].map(addKey);
      const { addListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
        addListItemSideEffects: sideEffects,
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      addListItem(testItem);

      expect(sideEffects[0]).toBeCalledWith(testItem);
    });
  });

  describe('removeListItem', () => {
    it('should throw an error if item is not in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { removeListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        removeListItem({ item: 'yoyo', key: 'helpMe' });
      };

      expect(test).toThrowError();
    });

    it('should throw error if item has no key', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { removeLisItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        removeLisItem({ item: 'hey' });
      };

      expect(test).toThrowError();
    });

    it('should call setState with current listState minus passed item', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { removeListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      removeListItem(keys[0]);
      const calledWith = setStateMock.mock.calls[0][0](keys);
      expect(calledWith).toEqual([keys[1]]);
    });

    it('should fire any sideEffects passed', () => {
      const sideEffects = [jest.fn()];
      const keys = ['hey', 'buddy'].map(addKey);
      const { removeListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
        removeListItemSideEffects: sideEffects,
      });
      removeListItem(keys[0]);

      expect(sideEffects[0]).toBeCalledWith(keys[0]);
    });
  });

  describe('updateListItem', () => {
    it('should throw an error if item is not in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { updateListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        updateListItem({ item: 'yoyo', key: 'helpMe' });
      };

      expect(test).toThrowError();
    });

    it('should throw error if item has no key', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { removeLisItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        removeLisItem({ item: 'hey' });
      };

      expect(test).toThrowError();
    });

    it('should call setState with current listState and the updated item', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { updateListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const updatedValue = {
        ...keys[0],
        item: "yolo"
      };
      updateListItem(updatedValue);
      const calledWith = setStateMock.mock.calls[0][0](keys);
      expect(calledWith).toEqual([updatedValue, keys[1]]);
    });
  });

  describe('toggleListItem', () => {
    it('should throw error if item has no key', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        toggleListItem({ item: 'hey' });
      };

      expect(test).toThrowError();
    });

    it('should call setState with current listState minus item if item is in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      toggleListItem(keys[0]);
      const calledWith = setStateMock.mock.calls[0][0](keys);
      expect(calledWith).toEqual([keys[1]]);
    });

    it('should call setState with current listState plus item if item is not in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      toggleListItem(testItem);
      const calledWith = setStateMock.mock.calls[0][0](keys);
      expect(calledWith).toEqual([...keys, testItem]);
    });

    it('should fire any removeListItemSideEffects passed if item is in state', () => {
      const sideEffects = [jest.fn()];
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
        removeListItemSideEffects: sideEffects,
      });
      toggleListItem(keys[0]);

      expect(sideEffects[0]).toBeCalledWith(keys[0]);
    });

    it('should fire any addListItemSideEffects passed if item is not in state', () => {
      const sideEffects = [jest.fn()];
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
        addListItemSideEffects: sideEffects,
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      toggleListItem(testItem);

      expect(sideEffects[0]).toBeCalledWith(testItem);
    });
  });

  describe("clearList", () => {
    it('should call setState with an empty array', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { clearList } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      clearList();

      expect(setStateMock).toBeCalledWith([]);
    });
  });

  describe("mapValue", () => {
    it('should give us the values of the keys', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { mapItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const keysValues = mapItem(R.identity);

      expect(keysValues).toEqual(['hey', 'buddy']);
    }); 
    
  });
});
