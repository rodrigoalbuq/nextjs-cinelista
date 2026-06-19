"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

type Theme = "light" | "dark";

type HeaderProps = {
  initialTheme: Theme;
};

const Header = ({ initialTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const applyTheme = (selectedTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    document.documentElement.style.colorScheme = selectedTheme;
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <h1 className={styles.header__logo}>
          <Link href="/">CineLista</Link>
        </h1>

        {!isMenuOpen && (
          <button
            className={styles.header__hamburger}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        <nav
          className={`${styles.header__nav} ${isMenuOpen ? styles.header__nav_open : ""}`}
        >
          <div className={styles.header__mobileTop}>
            <button
              type="button"
              className={`${styles.header__themeButton} ${styles.header__themeButton_mobile}`}
              onClick={toggleTheme}
              aria-label={`Ativar modo ${theme === "dark" ? "claro" : "escuro"}`}
            >
              <span aria-hidden="true" className={styles.header__themeIcon}>
                {theme === "dark" ? "☀" : "🌙"}
              </span>
            </button>

            <button
              type="button"
              className={styles.header__close}
              onClick={closeMenu}
              aria-label="Fechar menu"
            >
              x
            </button>
          </div>

          <button
            type="button"
            className={`${styles.header__themeButton} ${styles.header__themeButton_desktop}`}
            onClick={toggleTheme}
            aria-label={`Ativar modo ${theme === "dark" ? "claro" : "escuro"}`}
          >
            <span aria-hidden="true" className={styles.header__themeIcon}>
              {theme === "dark" ? "☀" : "🌙"}
            </span>
          </button>

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
