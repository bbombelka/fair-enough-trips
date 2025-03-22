import React from "react";
import { Layout } from "components";
import { useSearch } from "pages/api/hooks/useSearch";
import { SearchBar } from "components/search-bar/SearchBar";
import CardList from "components/card-list/CardList";
import { PostCard } from "components/post-card/PostCard";
import { Loader } from "components/loader/Loader";
import { Alert } from "components/alert/Alert";
import { Error as ErrorIcon } from "components/icons/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignsPost } from "@fortawesome/free-solid-svg-icons";
import styles from "styles/SearchTemplate.module.css";

export const SearchTemplate = () => {
  const { data: posts, setSearchTerm, isLoading, hasError } = useSearch({ isEnabled: true });

  return (
    <>
      <SearchBar setSearchTerm={setSearchTerm} isLoading={isLoading} />
      <Layout>
        <CardList listTitle="Search results:" dropGrid={hasError || posts.length === 0}>
          <Loader isLoading={isLoading} loadingHeading={"Searching . . ."} hasInternalBorder />
          {hasError ? (
            <Alert className={styles["alert"]} message="Something went wrong. Try to refresh the page.">
              <ErrorIcon width={96} height={96} />
            </Alert>
          ) : posts.length ? (
            posts.map((post) => <PostCard post={post} key={post.id} />)
          ) : (
            <Alert className={styles["alert"]} message="Seems like there are no trips there . . .">
              <FontAwesomeIcon icon={faSignsPost} fontSize={48} />{" "}
            </Alert>
          )}
        </CardList>
      </Layout>
    </>
  );
};
