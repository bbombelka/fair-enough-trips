import React, { FC } from "react";
import DistanceGraph from "./DistanceGraph";
import { useRouteSchemePoints } from "pages/api/hooks/useRouteSchemePoints";
import { Loader } from "components/loader/Loader";
import { Alert } from "components/alert/Alert";
import { Error as ErrorIcon } from "components/icons/Icons";
import styles from "styles/DistanceGraph.module.css";

type Props = {
  id: string;
};

const DistanceGraphContainer: FC<Props> = ({ id }) => {
  const { data, isLoading, hasError } = useRouteSchemePoints({ id, isEnabled: true });

  return (
    <div className={styles["route-scheme-container"]}>
      <Loader loadingHeading="Route scheme is loading" isLoading={isLoading} />
      {hasError ? (
        <Alert className={styles["error"]} message="Error while loading route scheme">
          <ErrorIcon fill="red" width={48} height={48} />
        </Alert>
      ) : (
        <DistanceGraph points={data?.points ?? []} />
      )}
    </div>
  );
};

export default DistanceGraphContainer;
