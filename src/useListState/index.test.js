import { addKey } from '@clutch/helpers';
import useListState from './index';
import * as useListStateUtils from "./utils";

describe('useListState Hook', () => {
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

      expect(useStateMock.mock.calls[0][0]).toEqual({
        list: keys,
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
      });
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

    it('should be able to specify a different unique key', () => {
      const keys = [{ id: 1, value: 'hey' }, { id: 2, value: 'buddy' }];
      const { listState } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
        uniqueKey: "id"
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
      let listState;
      global.testHook(() => {
        listState = useListState({
          initialValue: keys,
        });
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      global.act(() => {
        listState.addListItem(testItem);
      });

      expect(listState.listState).toEqual([...keys, testItem]);
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
      const setStateCallResults = setStateMock.mock.calls[0][0]({
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
        list: keys
      });
      expect(setStateCallResults.list).toEqual([keys[1]]);
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
      const { updateListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const test = () => {
        updateListItem({ item: 'hey' }); 
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
      const setStateCallResults = setStateMock.mock.calls[0][0]({
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
        list: keys
      });
      expect(setStateCallResults.list).toEqual([updatedValue, keys[1]]);
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
      const setStateCallResults = setStateMock.mock.calls[0][0]({
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
        list: keys
      });
      expect(setStateCallResults.list).toEqual([keys[1]]);
    });

    it('should call setState with current listState plus item if item is not in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { toggleListItem } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const testItem = { item: 'yoyo', key: 'helpMe' };
      toggleListItem(testItem);
      const setStateCallResults = setStateMock.mock.calls[0][0]({
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
        list: keys
      });
      expect(setStateCallResults.list).toEqual([...keys, testItem]);
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

      expect(setStateMock).toBeCalledWith({
        object: {},
        list: []
      });
    });
  });

  describe("setState", () => {
    it('should call setStateMock with new array', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { setState } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });

      const newData = ['yolo', 'swaggins'].map(addKey);
      setState(newData);
      const setStateCallResults = setStateMock.mock.calls[0][0]({
        object: useListStateUtils.arrayToObjectIfKeyExists(keys, "key"),
        list: keys
      });
      expect(setStateCallResults.list).toEqual(newData);
    }); 
    
    it('should throw an error if items do not have keys', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { setState } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const attemptedUpdate = () => {
        const newData = ['yolo', 'swaggins'];
        setState(newData);
      };

      expect(attemptedUpdate).toThrowError();
    });
  });

  describe('getItemForKey', () => {
    it('should throw an error if key is not in state', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { getItemForKey } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const attemptedGet = () => {
        getItemForKey("test");
      };

      expect(attemptedGet).toThrowError();
    });

    it('should return the item if it exists', () => {
      const keys = ['hey', 'buddy'].map(addKey);
      const { getItemForKey } = useListState({
        initialValue: keys,
        useStateDep: useStateMock,
      });
      const retrievedItem = getItemForKey(keys[0].key);

      expect(retrievedItem).toEqual(keys[0]);
    });
  });  
});
