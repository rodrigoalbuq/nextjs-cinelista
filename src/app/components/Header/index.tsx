"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <h1 className={styles.header__logo}>
          <Link href="/">CineLista</Link>
        </h1>

        <button
          className={styles.header__hamburger}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={isMenuOpen ? styles.open : ""}></span>
          <span className={isMenuOpen ? styles.open : ""}></span>
          <span className={isMenuOpen ? styles.open : ""}></span>
        </button>

        <nav
          className={`${styles.header__nav} ${isMenuOpen ? styles.header__nav_open : ""}`}
        >
          <Link href="/" onClick={closeMenu}>
            Início
          </Link>
          <Link href="/filmes/em-alta" onClick={closeMenu}>
            Em alta
          </Link>
          <Link href="/filmes/populares" onClick={closeMenu}>
            Populares
          </Link>
          <Link href="/filmes/top-filmes" onClick={closeMenu}>
            Top Filmes
          </Link>
        </nav>
      </div>
    </header>
  );
};
export default Header;
