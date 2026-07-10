import HistoryScreen from './index';
import {renderWithQuery} from '@/utils/test-utils';
import * as api from '@/api/workouts';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

describe('HistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('shows loading state initially', () => {
    jest
      .spyOn(api, 'getWorkouts')
      .mockImplementation(() => new Promise(() => {}));

    const {queryByText} = renderWithQuery(<HistoryScreen />);
    expect(queryByText('exercises')).toBeNull();
  });

  it('shows error message on error', async () => {
    jest.spyOn(api, 'getWorkouts').mockRejectedValue(new Error('API down'));

    const {findByText} = renderWithQuery(<HistoryScreen />);

    expect(await findByText(/Не удалось загрузить/)).toBeTruthy();
  });

  it('renders workouts list on success', async () => {
    jest.spyOn(api, 'getWorkouts').mockResolvedValue([
      {id: '1', date: 1704067200000, exercises: [], isActive: false}, // 2024-01-01
      {
        id: '2',
        date: 1706745600000,
        exercises: [
          {
            id: '1',
            exerciseId: '2',
            sets: [{id: '3', reps: 2, weight: 10, completed: true}],
          },
        ],
        isActive: false,
      }, // 2024-02-01
    ]);

    const {findByText} = renderWithQuery(<HistoryScreen />);

    expect(await findByText('0 exercises')).toBeTruthy();
    expect(await findByText('1 exercises')).toBeTruthy();
  });
});
