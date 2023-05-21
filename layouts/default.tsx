import { Fragment } from "react";

import Head from "next/head";

import TopNavBar from "components/TopNavBar";
import FooterNavBar from "components/FooterNavBar";

import styles from "styles/Home.module.scss";

type DefaultLayoutProps = {
  title?: string;
  style?: any;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  title = "",
  ...props
}) => {
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>

      <TopNavBar />

      <main className={styles.main} {...props}>
        <div>
          {title && <h1 className={styles.pageTitle}>{title}</h1>}

          {children}
        </div>
      </main>

      <FooterNavBar />
    </Fragment>
  );
};

export default DefaultLayout;
