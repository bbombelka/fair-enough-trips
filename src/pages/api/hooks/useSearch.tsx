import React, { useEffect, useState } from "react";

type Props = {
  isEnabled: boolean;
};

export const useSearch = ({ isEnabled }: Props) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const clearData = () => {
    setData([]);
  };

  useEffect(() => {
    if (isEnabled && searchTerm) {
      fetch("/api/search?searchTerm=" + searchTerm)
        .then((res) => res.json())
        .then((res) => setData(res));
    }
  }, [isEnabled, searchTerm]);

  return { setSearchTerm, data, clearData };
};
