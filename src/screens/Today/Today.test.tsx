import {render, fireEvent} from '@testing-library/react-native';
import TodayScreen from './index';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

describe('TodayScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the title and CTA', () => {
    const {getByText} = render(<TodayScreen />);
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('Start training')).toBeTruthy();
  });

  it('navigates to ActiveWorkout on Start press', () => {
    const {getByText} = render(<TodayScreen />);

    fireEvent.press(getByText('Start training'));

    expect(mockNavigate).toHaveBeenCalledWith('ActiveWorkout');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
