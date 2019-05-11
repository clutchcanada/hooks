import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { useStateMock } from './common';

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
