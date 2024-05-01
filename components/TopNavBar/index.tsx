import Link from "next/link";
import { useRouter } from "next/router";

import classNames from "classnames";

import styles from "./styles.module.scss";

const pages = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/plugs",
    title: "Plugs",
  },
  // {
  //   url: "/tapo-light",
  //   title: "Tapo Light",
  // },
  // {
  //   url: "/dashboard",
  //   title: "Dashboard",
  // },
  // {
  //   url: "/music/room",
  //   title: "Music Room",
  // },
];

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className={styles.wrapper}>
      <ul className={styles.list}>
        {pages.map((page) => {
          return (
            <li key={page.title}>
              <Link
                href={page.url}
                className={classNames({
                  [styles.active]: router.pathname === page.url,
                })}
              >
                {page.title}
              </Link>
            </li>
          );
        })}

        {/* {!session && (
          <li>
            <button onClick={() => signIn("spotify")}>Sign in</button>
          </li>
        )}

        {!loading && session && (
          <li>
            <button onClick={() => signOut()}>Sign out</button>
          </li>
        )} */}
      </ul>
    </nav>
  );
};

export default NavBar;
