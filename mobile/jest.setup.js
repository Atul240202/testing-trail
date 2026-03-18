/* eslint-env jest */
import '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('react-native-background-fetch', () => ({
  configure: jest.fn(),
  scheduleTask: jest.fn(),
  finish: jest.fn(),
  stop: jest.fn(),
  status: jest.fn(() => Promise.resolve(2)),
  registerHeadlessTask: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
