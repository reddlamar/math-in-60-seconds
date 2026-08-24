import { renderHook, act } from '@testing-library/react-native';
import { useGameTimer } from './useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts at the full duration and does not count down until started', async () => {
    const onExpire = jest.fn();
    const { result } = await renderHook(() => useGameTimer(60000, onExpire));
    expect(result.current.timeLeft).toBe(60000);
    expect(result.current.isRunning).toBe(false);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.timeLeft).toBe(60000);
  });

  it('counts down toward zero once started', async () => {
    const onExpire = jest.fn();
    const { result } = await renderHook(() => useGameTimer(60000, onExpire));

    await act(async () => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBeLessThanOrEqual(59000);
    expect(result.current.timeLeft).toBeGreaterThan(0);
  });

  it('calls onExpire exactly once and stops at zero, never going negative', async () => {
    const onExpire = jest.fn();
    const { result } = await renderHook(() => useGameTimer(1000, onExpire));

    await act(async () => {
      result.current.start();
    });
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('resets to the full duration and stops when reset is called', async () => {
    const onExpire = jest.fn();
    const { result } = await renderHook(() => useGameTimer(1000, onExpire));

    await act(async () => {
      result.current.start();
    });
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(0);

    await act(async () => {
      result.current.reset();
    });
    expect(result.current.timeLeft).toBe(1000);
    expect(result.current.isRunning).toBe(false);
  });
});
