import { useEffect, useState } from "react";

import { ParseGpxResponse } from "../parse-gpx";
import useSessionStorage from "hooks/useSessionStorage";

type Props = {
  isEnabled: boolean;
  id: string;
};

export const useGPXData = ({ isEnabled, id }: Props) => {
  const [data, setData] = useSessionStorage<ParseGpxResponse | undefined>(id);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isEnabled && id && !data) {
      setHasError(false);
      setIsLoading(true);
      fetch(`/api/parse-gpx?id=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          setData(res);
        })
        .catch(() => {
          setHasError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isEnabled, id]);

  return { data, isLoading, hasError };
};
