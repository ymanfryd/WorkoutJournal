import {render, fireEvent} from '@testing-library/react-native';
import WorkoutScreen from './index';
import {renderWithQuery} from '@/utils/test-utils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

describe('WorkoutScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the title and CTA', async () => {
    const {getByText, findByText} = renderWithQuery(<WorkoutScreen />);
    getByText('Workout');
    await findByText('Create empty workout');
  });
});
