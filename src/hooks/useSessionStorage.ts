import { useState, useEffect, Dispatch, SetStateAction } from "react";

function useSessionStorage<T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = sessionStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error reading sessionStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to sessionStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useSessionStorage;
