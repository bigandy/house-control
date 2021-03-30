import { Fragment } from "react";

import Head from "next/head";

import { GoogleFonts } from "next-google-fonts";

import NavBar from "components/NavBar";

import styles from "styles/Home.module.scss";

export default function DefaultLayout({ children, title = "" }) {
  return (
    <Fragment>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" />

      <NavBar />

      <Head>
        <title>{title}</title>
      </Head>

      {title && <h1 className={styles.pageTitle}>{title}</h1>}

      {children}
    </Fragment>
  );
}
