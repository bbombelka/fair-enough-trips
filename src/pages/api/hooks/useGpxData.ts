import { useEffect, useState } from "react";

import { ParseGpxResponse } from "../parse-gpx";

type Props = {
  isEnabled: boolean;
  id: string;
};

export const useGPXData = ({ isEnabled, id }: Props) => {
  const [data, setData] = useState<ParseGpxResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isEnabled && id) {
      try {
        setHasError(false);
        setIsLoading(true);
        fetch(`/api/parse-gpx?id=${id}`)
          .then((res) => res.json())
          .then((res) => {
            setData(res);
            setIsLoading(false);
          });
      } catch {
        setHasError(true);
      }
    }
  }, [isEnabled, id]);

  return { data, isLoading, hasError };
};
