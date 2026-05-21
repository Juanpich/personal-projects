import { useCallback, useEffect, useRef, useState } from "react";
import type { UseApiCall } from "../models";

type Data<T> = T | null;
type CustomError = Error | null;

type UseApiOptions<P> = {
    autoFetch?: boolean;
} & (P extends null ? { params?: P } : { params: P });

interface UseApiResult<T, P> {
    loading: boolean;
    error: CustomError;
    data: Data<T>;
    fetch: (param: P) => void;
    refetch: () => void;           
    setData: React.Dispatch<React.SetStateAction<Data<T>>>;
}

export const useApi = <T, P>(
    apiCall: (param: P) => UseApiCall<T>,
    options?: UseApiOptions<P>
): UseApiResult<T, P> => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<CustomError>(null);
    const [data, setData] = useState<Data<T>>(null);

    const optionsRef = useRef(options);

    const lastParams = useRef<P | null>(options?.params ?? null);

    const fetch = useCallback((param: P) => {
        lastParams.current = param

        const { call, controller } = apiCall(param);

        setLoading(true);

        call
            .then((response) => {
                setData(response.data);
                setError(null);
            })
            .catch((err) => {
                if (err.name !== "CanceledError") {
                    setError(err);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort();
    }, [apiCall]);

    const refetch = useCallback(() => {
        if (lastParams.current !== null) {
            fetch(lastParams.current);
        }
    }, [fetch]);

    useEffect(() => {
        const opts = optionsRef.current;
        if (opts?.autoFetch) {
            fetch(opts.params as P);
        }
    }, [fetch]);

    return { loading, data, error, fetch, refetch, setData };
};