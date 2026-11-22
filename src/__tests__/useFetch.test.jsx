import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from 'vitest';
import useFetch from '../hooks/useFetch';

describe('useFetch Hook', () => {
    // Test 1: Initial loading state
    it(`starts with loading state`, () => {
        vi.stubGlobal(`fetch`, vi.fn(() => new Promise(() => {})));

        const { result } = renderHook(() => useFetch(`/products`));
        expect(result.current.loading).toBe(true);
        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe(null);

        vi.unstubAllGlobals();
    
    });

    // Test 2: Successful data fetching
    it(`fetches data successfully`, async () => {
        const mockData = [{ id: 1, name: 'Product 1' }];
        vi.stubGlobal(`fetch`, vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        ));

        const { result } = renderHook(() => useFetch(`/products`));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBe(null);

        vi.unstubAllGlobals();
    });

    // Test 3: Handling fetch errors
    it(`returns an error when fetch fails`, async () => {
        vi.stubGlobal(`fetch`, vi.fn(() =>
            Promise.reject(new Error('Fetch failed'))
        ));

        const { result } = renderHook(() => useFetch(`/products`));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.data).toBe(null);
        expect(result.current.error).toBe('Fetch failed');

        vi.unstubAllGlobals();
    });
});