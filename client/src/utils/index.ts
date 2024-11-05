import { useCallback, useRef } from 'react';

export function useDebounce<T extends (arg?: string) => void>(
  callback: T, 
  delay: number
): (arg?: string) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (arg?: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        callback(arg);
      }, delay);
    },
    [callback, delay]
  );
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function serverRequest({method="GET", path="", body=""}) {
  const url = API_URL.concat("/" + path);
  let response;
  if (method === "GET") {
    response = await fetch(url);
  } else {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  }
  const data = await response.json();
  return data;
}