import { useState, useCallback } from "react";

export function useFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  }, []);

  const executeFetch = useCallback(
    async (fetchFn: () => Promise<T>, shouldReset = true) => {
      if (shouldReset) reset();

      try {
        setIsLoading(true);
        const result = await fetchFn();
        setData(result);
        setSuccess(true);
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    },
    [reset]
  );

  return { data, isLoading, error, isSuccess, executeFetch };
}
