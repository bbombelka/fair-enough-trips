import { faSignsPost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, Footer } from "components";
import { Alert } from "components/alert/Alert";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "styles/404.module.css";

const REDIRECTION_DELAY_MS = 5000;

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/");
    }, REDIRECTION_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Not Found Page @ Fair Enough Trips</title>
        <meta name="description" content="Fair Enough Trips Not Found Page" />
      </Head>
      <div>
        <Navbar />
        <main className={`layout ${styles.container}`}>
          <Alert className={styles["alert"]} message="Ooops! Let's go somewhere else! ">
            <FontAwesomeIcon icon={faSignsPost} fontSize={48} />
          </Alert>
        </main>
        <Footer isSticky />
      </div>
    </>
  );
}
