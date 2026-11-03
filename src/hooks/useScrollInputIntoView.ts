import {useCallback, useEffect, useRef} from 'react';
import {Keyboard, TextInput, type NativeScrollEvent, type NativeSyntheticEvent} from 'react-native';

type ScrollTarget = {
  scrollTo?: (options: {y: number; animated: boolean}) => void;
  scrollToOffset?: (options: {offset: number; animated: boolean}) => void;
  getNativeScrollRef: () => unknown | null;
};

export function useScrollInputIntoView(scrollRef: React.RefObject<ScrollTarget | null>) {
  const focusedInput = useRef<TextInput | null>(null);
  const keyboardVisible = useRef(false);
  const keyboardTop = useRef<number | null>(null);
  const scrollOffset = useRef(0);
  const retryTimers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const clearRetries = useCallback(() => {
    retryTimers.current.forEach(clearTimeout);
    retryTimers.current.clear();
  }, []);

  const ensureFocusedInputVisible = useCallback((delay: number) => {
    if (!focusedInput.current || !scrollRef.current) return;

    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => {
      retryTimers.current.delete(timer);
      if (!keyboardVisible.current) return;

      requestAnimationFrame(() => {
        const input = focusedInput.current;
        const scrollView = scrollRef.current;
        if (!input || !scrollView) return;

        input.measureInWindow((_inputX, inputY, _inputWidth, inputHeight) => {
          const scrollTarget = scrollView.getNativeScrollRef() as {
            measureInWindow?: (callback: (x: number, y: number, width: number, height: number) => void) => void;
            getNativeScrollRef?: () => {measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void} | null;
          } | null;
          const nativeScrollTarget = scrollTarget && 'measureInWindow' in scrollTarget
            ? scrollTarget
            : scrollTarget?.getNativeScrollRef?.();
          nativeScrollTarget?.measureInWindow?.((_scrollX, scrollY, _scrollWidth, scrollHeight) => {
            const scrollBottom = scrollY + scrollHeight;
            const visibleBottom = keyboardTop.current == null
              ? scrollBottom
              : Math.min(scrollBottom, keyboardTop.current);
            const overflow = inputY + inputHeight + 72 - visibleBottom;
            if (overflow <= 0) return;

            const offset = scrollOffset.current + overflow;
            if (scrollView.scrollToOffset) {
              scrollView.scrollToOffset({offset, animated: false});
            } else {
              scrollView.scrollTo?.({y: offset, animated: false});
            }
          });
        });
      });
    }, delay);
    retryTimers.current.add(timer);
  }, [scrollRef]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', event => {
      keyboardVisible.current = true;
      keyboardTop.current = event.endCoordinates.screenY;
      clearRetries();
      ensureFocusedInputVisible(100);
      ensureFocusedInputVisible(350);
      ensureFocusedInputVisible(650);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisible.current = false;
      keyboardTop.current = null;
      clearRetries();
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      clearRetries();
    };
  }, [clearRetries, ensureFocusedInputVisible]);

  const focusInput = useCallback((input: TextInput | null) => {
    focusedInput.current = input;
    clearRetries();
    if (input) ensureFocusedInputVisible(300);
  }, [clearRetries, ensureFocusedInputVisible]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  }, []);

  return {focusInput, handleScroll};
}
