import React, { FC } from "react";
import { Cell } from "components/table-data/components/Cell";
import styles from "styles/GearTable.module.css";
import { StarRate } from "components/star-rate/StarRate";

export interface GearTableProps {
  statsGeneral?: Record<string, any>;
  statsSpecific?: Record<string, any>;
}

export const GearTable: FC<GearTableProps> = ({ statsGeneral, statsSpecific }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const match = dateString.match(/^(\d{4})-(\d{2})/);
    if (!match) return dateString;
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[monthIndex] || "";
    return `${month} ${year}`;
  };

  const uppercaseFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatGeneralStat = (key: string, value: any) => {
    if (value === undefined || value === null || value === "") return null;
    switch (key) {
      case "price":
        return { label: "Price", value: `€${value}` };
      case "weight":
        return { label: "Weight", value: `${value} g` };
      case "volume":
        return { label: "Volume", value: `${value} L` };
      case "purchased":
        return { label: "Used since", value: formatDate(value) };
      case "rating":
        return { label: "Rating", value: `${value}/10` };
      case "durability":
        return { label: "Durability", value: `${value}/10` };
      case "frequency":
        return { label: "Times used", value: `${value}` };
      default:
        return { label: uppercaseFirstLetter(key), value: String(value) };
    }
  };

  const generalKeysOrder = ["purchased", "price", "weight", "rating", "durability", "frequency"];

  if (!statsGeneral && !statsSpecific) return null;

  return (
    <div id="gear-stats" className={styles.container}>
      <table className={styles.table}>
        <tbody className={styles.tbody}>
          {statsGeneral &&
            generalKeysOrder.map((key) => {
              const val = statsGeneral[key];
              if (val === undefined || val === null || val === "") return null;

              if (key === "rating" || key === "durability") {
                const label = key === "rating" ? "Rating" : "Durability";
                return (
                  <Cell key={key} label={label}>
                    <a href="/about#rating">
                      <StarRate rate={val / 2} />
                    </a>
                  </Cell>
                );
              }

              const formatted = formatGeneralStat(key, val);
              if (!formatted) return null;
              return <Cell key={key} label={formatted.label} value={formatted.value} />;
            })}
          {statsSpecific &&
            Object.entries(statsSpecific).map(([key, val]) => {
              if (val === undefined || val === null || val === "") return null;
              return <Cell key={key} label={uppercaseFirstLetter(key)} value={String(val)} />;
            })}
        </tbody>
      </table>
    </div>
  );
};
