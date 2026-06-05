"use client";

import { useEffect, useState } from "react";
import { RouteSchemePointsResponse } from "pages/api/route-scheme-points";

import { useRouteSchemePointsProps } from "types/hooks/useRouteSchemePoints.types";

const useRouteSchemePoints = ({ isEnabled, id }: useRouteSchemePointsProps) => {
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

export default useRouteSchemePoints;
