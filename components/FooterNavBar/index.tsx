import Link from "next/link";
import { useRouter } from "next/router";

import classNames from "classnames";

import styles from "../TopNavBar/styles.module.scss";

const pages = [
  {
    url: "/plugs",
    title: "Plugs",
  },
  {
    url: "/lights",
    title: "Lights",
  },
  {
    url: "/lights/color",
    title: "Lights / Color",
  },
];

const FooterNavBar = () => {
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

export default FooterNavBar;
