import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { SearchPostType } from "types/PostPage.types";

type Props = {
  isEnabled: boolean;
};

export const useSearch = ({ isEnabled }: Props) => {
  const [data, setData] = useState<SearchPostType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { pathname } = useRouter();

  const clearData = () => {
    setSearchTerm("");
    setData([]);
  };

  useEffect(() => {
    if (isEnabled && searchTerm) {
      try {
        setHasError(false);
        setIsLoading(true);
        fetch("/api/search?searchTerm=" + searchTerm)
          .then((res) => res.json())
          .then((res) => {
            setData(res);
            setIsLoading(false);
          });
      } catch {
        setHasError(true);
      }
    }
  }, [isEnabled, searchTerm]);

  useEffect(() => {
    clearData();
  }, [pathname]);

  return { setSearchTerm, data, clearData, isLoading, hasError };
};
