import { Fragment } from "react";

import Head from "next/head";

import { GoogleFonts } from "next-google-fonts";

import TopNavBar from "components/TopNavBar";
import FooterNavBar from "components/FooterNavBar";

import styles from "styles/Home.module.scss";

export default function DefaultLayout({
  children,
  title = "",
  ...props
}) {
  return (
    <Fragment>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" />

      <Head>
        <title>{title}</title>
      </Head>

      <TopNavBar />

      <main className={styles.main} {...props}>
        <div>
          {title && (
            <h1 className={styles.pageTitle}>{title}</h1>
          )}

          {children}
        </div>
      </main>

      <FooterNavBar />
    </Fragment>
  );
}
