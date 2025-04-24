import React, { FC } from "react";
import RouteScheme from "./RouteScheme";
import { useRouteSchemePoints } from "pages/api/hooks/useRouteSchemePoints";
import { Loader } from "components/loader/Loader";
import { Alert } from "components/alert/Alert";
import { Error as ErrorIcon } from "components/icons/Icons";
import styles from "styles/RouteScheme.module.css";

type Props = {
  id: string;
};

const RouteSchemeContainer: FC<Props> = ({ id }) => {
  const { data, isLoading, hasError } = useRouteSchemePoints({ id, isEnabled: true });

  return (
    <div className={styles["route-scheme-container"]}>
      <Loader loadingHeading="Route scheme is loading" isLoading={isLoading} />
      {hasError ? (
        <Alert className={styles["error"]} message="Error while loading route scheme">
          <ErrorIcon fill="red" width={48} height={48} />
        </Alert>
      ) : (
        <RouteScheme points={data?.points ?? []} disabledCharts={data?.disabledModes ?? []} />
      )}
    </div>
  );
};

export default RouteSchemeContainer;
