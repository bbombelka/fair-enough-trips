"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchPostType } from "types/pages/post.types";
import { UseSearchProps } from "types/hooks/useSearch.types";

const useSearch = ({ isEnabled }: UseSearchProps) => {
  const [data, setData] = useState<SearchPostType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const pathname = usePathname();

  const clearData = () => {
    setSearchTerm("");
    setData([]);
  };

  useEffect(() => {
    if (isEnabled && searchTerm) {
      setHasError(false);
      setIsLoading(true);
      fetch("/api/search?searchTerm=" + searchTerm)
        .then((res) => res.json())
        .then((res) => {
          setData(res);
          setIsLoading(false);
        })
        .catch(() => {
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [isEnabled, searchTerm]);

  useEffect(() => {
    clearData();
  }, [pathname]);

  return { setSearchTerm, data, clearData, isLoading, hasError };
};

export default useSearch;
