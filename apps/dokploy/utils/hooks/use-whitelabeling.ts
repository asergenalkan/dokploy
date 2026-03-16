import { useEffect, useMemo } from "react";
import { api } from "@/utils/api";

const WL_CACHE_KEY = "whitelabeling-cache";
const WL_PUBLIC_CACHE_KEY = "whitelabeling-public-cache";

function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.error("Failed to read whitelabeling cache", error);
    return null;
  }
}

function setCached<T>(key: string, value: T | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Failed to write whitelabeling cache", error);
  }
}

/**
 * Hook to access whitelabeling config for authenticated pages (dashboard, services, etc.).
 * Requires the user to be logged in.
 */
export function useWhitelabeling() {
	const cached = useMemo(() => getCached<any>(WL_CACHE_KEY), []);
	const { data, ...rest } = api.whitelabeling.get.useQuery(undefined, {
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		initialData: cached ?? undefined,
	});

	useEffect(() => {
		setCached(WL_CACHE_KEY, data ?? null);
	}, [data]);

	return { config: data ?? null, ...rest };
}

/**
 * Hook to access the public whitelabeling config.
 * Only for unauthenticated pages (login, register, error, invitation, password reset).
 */
export function useWhitelabelingPublic() {
	const cached = useMemo(() => getCached<any>(WL_PUBLIC_CACHE_KEY), []);
	const { data, ...rest } = api.whitelabeling.getPublic.useQuery(undefined, {
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		initialData: cached ?? undefined,
	});

	useEffect(() => {
		setCached(WL_PUBLIC_CACHE_KEY, data ?? null);
	}, [data]);

	return { config: data ?? null, ...rest };
}
