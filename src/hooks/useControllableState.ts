import { useCallback, useState } from 'react';

interface Options<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/** Suporta uso controlado (`value`) e não controlado (`defaultValue`). Ao voltar de controlado para não controlado, mantém o último valor. */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: Options<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const [carried, setCarried] = useState<{ value: T } | null>(null);
  const isControlled = value !== undefined;

  if (isControlled) {
    if (carried?.value !== value) setCarried({ value });
  } else if (carried) {
    // Saiu do modo controlado: o estado interno assume o último valor conhecido.
    setCarried(null);
    setInternal(carried.value);
  }

  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [isControlled ? value : internal, set];
}
