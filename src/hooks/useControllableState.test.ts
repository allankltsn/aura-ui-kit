import { act, renderHook } from '@testing-library/react';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('modo não controlado guarda o estado e avisa a mudança', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: 'a', onChange }));
    act(() => result.current[1]('b'));
    expect(result.current[0]).toBe('b');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('modo controlado só reflete o valor recebido', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 'a', onChange }),
      { initialProps: { value: 'x' } },
    );
    act(() => result.current[1]('y'));
    expect(result.current[0]).toBe('x');
    expect(onChange).toHaveBeenCalledWith('y');
    rerender({ value: 'y' });
    expect(result.current[0]).toBe('y');
  });

  it('trocar de não controlado para controlado não perde o valor nem lança erro', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value?: string }) => useControllableState({ value, defaultValue: 'a' }),
      { initialProps: {} as { value?: string } },
    );
    act(() => result.current[1]('b'));
    rerender({ value: 'c' });
    expect(result.current[0]).toBe('c');
    rerender({});
    expect(result.current[0]).toBe('c');
  });
});
