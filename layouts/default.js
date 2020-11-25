import { Fragment } from "react";

import GoogleFonts from "next-google-fonts";

import NavBar from "components/NavBar";

export default function DefaultLayout({ children }) {
  return (
    <Fragment>
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Piazzolla:wght@400;700&display=swap" />

      <NavBar />
      {children}
    </Fragment>
  );
}
