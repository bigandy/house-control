import Link from "next/link";
import { useRouter } from "next/router";

import classNames from "classnames";

import styles from "./styles.module.scss";

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className={styles.wrapper}>
      <ul>
        <li>
          <Link href="/">
            <a
              className={classNames({
                [styles.active]: router.pathname === "/",
              })}
            >
              Home
            </a>
          </Link>
        </li>
        <li>
          <Link href="/dashboard">
            <a
              className={classNames({
                [styles.active]: router.pathname === "/dashboard",
              })}
            >
              Dashboard
            </a>
          </Link>
        </li>
        <li>
          <Link href="/sensor">
            <a
              className={classNames({
                [styles.active]: router.pathname === "/sensor",
              })}
            >
              Sensor
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
