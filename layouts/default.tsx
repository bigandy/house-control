import { Fragment } from "react";

import Head from "next/head";

// import { GoogleFonts } from "next-google-fonts";

import { Piazzolla } from "next/font/google";

const piazzolla = Piazzolla({ subsets: ["latin"] });

import TopNavBar from "components/TopNavBar";
import FooterNavBar from "components/FooterNavBar";

import styles from "styles/Home.module.scss";

type DefaultLayoutProps = {
  title?: string;
  style?: any;
  children: JSX.Element | JSX.Element[];
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  title = "",
  ...props
}) => {
  return (
    <Fragment>
      <style jsx global>{`
        html {
          font-family: ${piazzolla.style.fontFamily};
        }
      `}</style>

      <Head>
        <title>{title}</title>
      </Head>

      <TopNavBar />

      <main className={`${styles.main}`} {...props}>
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
