import { configure, shallow } from 'enzyme';
import { act } from "react-dom/test-utils";
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';
import { useStateMock, testHook } from './common';

configure({ adapter: new Adapter() });

const defaultTheme = {
  getColor: () => '#FFFFFF',
};

jest.mock('uuid', () => {
  let i = 0;
  return {
    v4: () => {
      i += 1;
      return i.toString();
    },
  };
});

global.mountWithTheme = ({ tree, theme = defaultTheme, mounter = shallow }) =>
  mounter(tree(), {
    theme,
  });
global.useStateMock = useStateMock;
global.testHook = testHook;
global.act = act;
