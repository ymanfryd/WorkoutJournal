import {render, fireEvent} from '@testing-library/react-native';
import Button from '../components/Button';

describe('Button', () => {
  it('renders the text', () => {
    const {getByText} = render(<Button text="Sign In" onPress={() => {}} />);
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const {getByText} = render(<Button text="Sign In" onPress={onPress} />);

    fireEvent.press(getByText('Sign In'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Button text="Sign In" onPress={onPress} disabled />,
    );

    fireEvent.press(getByText('Sign In'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
