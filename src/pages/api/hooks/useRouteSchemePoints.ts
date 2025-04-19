import { useEffect, useState } from "react";
import { RouteSchemePointsResponse } from "../route-scheme-points";

type Props = {
  isEnabled: boolean;
  id: string;
};

export const useRouteSchemePoints = ({ isEnabled, id }: Props) => {
  const [data, setData] = useState<RouteSchemePointsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isEnabled && id && !data) {
      setHasError(false);
      setIsLoading(true);
      fetch(`/api/route-scheme-points?id=${id}`)
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
