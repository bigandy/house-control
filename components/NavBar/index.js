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
    url: "/dashboard",
    title: "Dashboard",
  },
  {
    url: "/plugs",
    title: "Plugs",
  },
];

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className={styles.wrapper}>
      <ul>
        {pages.map((page) => {
          return (
            <li key={page.title}>
              <Link href={page.url}>
                <a
                  className={classNames({
                    [styles.active]: router.pathname === page.url,
                  })}
                >
                  {page.title}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
