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
    getByText('Ready to train?');
    getByText('Start an empty workout and add exercises as you go');
    await findByText('Start empty workout');
  });
});
