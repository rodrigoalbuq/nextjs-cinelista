"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Header.module.css";
import { Filme } from "@/types/types";
import { getTmdbImageUrl } from "@/lib/tmdbImage";

type Theme = "light" | "dark";

type HeaderProps = {
  initialTheme: Theme;
};

const Header = ({ initialTheme }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Filme[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shouldShowSuggestions =
    isSearchOpen &&
    searchTerm.trim().length >= 2 &&
    searchTerm.trim().length > 0;

  const clearSuggestions = () => {
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    clearSuggestions();
    setIsLoadingSuggestions(false);

    if (pathname !== "/filmes/busca") {
      setSearchTerm("");
    }
  }, [pathname]);

  const applyTheme = (selectedTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    document.documentElement.style.colorScheme = selectedTheme;
  };

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";
    setSearchTerm(currentQuery);

    if (pathname === "/filmes/busca" && currentQuery) {
      setIsSearchOpen(true);
      return;
    }

    if (pathname !== "/filmes/busca") {
      closeSearch();
    }
  }, [closeSearch, pathname, searchParams]);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!shouldShowSuggestions) {
      setActiveSuggestionIndex(-1);
    }
  }, [shouldShowSuggestions]);

  useEffect(() => {
    if (!suggestions.length) {
      setActiveSuggestionIndex(-1);
    }
  }, [suggestions]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const normalizedSearch = searchTerm.trim();

    if (!isSearchOpen || normalizedSearch.length < 2) {
      clearSuggestions();
      setIsLoadingSuggestions(false);
      return;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);

      try {
        const response = await fetch(
          `/api/filmes/busca?q=${encodeURIComponent(normalizedSearch)}`,
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar sugestões de filmes.");
        }

        const data = (await response.json()) as Filme[];

        if (!isCancelled) {
          setSuggestions(data);
          setActiveSuggestionIndex(data.length > 0 ? 0 : -1);
        }
      } catch {
        if (!isCancelled) {
          clearSuggestions();
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isSearchOpen, searchTerm]);

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

  const executeSearch = () => {
    const normalizedSearch = searchTerm.trim();
    clearSuggestions();

    if (!normalizedSearch) {
      router.push("/filmes/busca");
      closeMenu();
      return;
    }

    router.push(`/filmes/busca?q=${encodeURIComponent(normalizedSearch)}`);
    closeMenu();
  };

  const handleSearchButtonClick = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    executeSearch();
  };

  const openSuggestion = (index: number) => {
    const selectedMovie = suggestions[index];

    if (!selectedMovie) {
      return;
    }

    clearSuggestions();
    closeMenu();
    router.push(`/filmes/${selectedMovie.id}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    clearSuggestions();
    setIsLoadingSuggestions(false);

    if (pathname === "/filmes/busca") {
      router.push("/filmes/busca");
    }

    inputRef.current?.focus();
  };

  const handleSuggestionClick = () => {
    clearSuggestions();
    closeMenu();
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!shouldShowSuggestions || isLoadingSuggestions) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((currentIndex) =>
        currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      openSuggestion(activeSuggestionIndex);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
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

          <form
            ref={searchRef}
            className={`${styles.header__search} ${isSearchOpen ? styles.header__search_open : ""}`}
            onSubmit={(event) => {
              event.preventDefault();
              executeSearch();
            }}
            role="search"
          >
            <label className={styles.header__srOnly} htmlFor="movie-search">
              Buscar filme por título
            </label>
            <div className={styles.header__searchField}>
              <div className={styles.header__searchInputWrap}>
                <input
                  id="movie-search"
                  ref={inputRef}
                  className={styles.header__searchInput}
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar por título"
                  autoComplete="off"
                  aria-controls="movie-search-suggestions"
                  aria-activedescendant={
                    activeSuggestionIndex >= 0
                      ? `movie-search-suggestion-${suggestions[activeSuggestionIndex]?.id}`
                      : undefined
                  }
                />
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.header__clearButton}
                    onClick={handleClearSearch}
                    aria-label="Limpar busca"
                  >
                    ×
                  </button>
                )}
              </div>

              {shouldShowSuggestions && (
                <div
                  id="movie-search-suggestions"
                  className={styles.header__suggestions}
                  role="listbox"
                >
                  {isLoadingSuggestions ? (
                    <p className={styles.header__suggestionState}>
                      Buscando...
                    </p>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((filme) => (
                      <Link
                        key={filme.id}
                        id={`movie-search-suggestion-${filme.id}`}
                        href={`/filmes/${filme.id}`}
                        className={`${styles.header__suggestionItem} ${
                          activeSuggestionIndex >= 0 &&
                          suggestions[activeSuggestionIndex]?.id === filme.id
                            ? styles.header__suggestionItem_active
                            : ""
                        }`}
                        onClick={handleSuggestionClick}
                        onMouseEnter={() =>
                          setActiveSuggestionIndex(
                            suggestions.findIndex(
                              (item) => item.id === filme.id,
                            ),
                          )
                        }
                        role="option"
                        aria-selected={
                          activeSuggestionIndex >= 0 &&
                          suggestions[activeSuggestionIndex]?.id === filme.id
                        }
                      >
                        <div className={styles.header__suggestionPosterWrap}>
                          {filme.poster_path ? (
                            <Image
                              className={styles.header__suggestionPoster}
                              alt={`Poster de ${filme.title}`}
                              src={getTmdbImageUrl(filme.poster_path) || ""}
                              width={42}
                              height={58}
                            />
                          ) : (
                            <div
                              className={
                                styles.header__suggestionPosterPlaceholder
                              }
                              aria-label={`Sem pôster para ${filme.title}`}
                            >
                              <span
                                className={styles.header__suggestionPosterBadge}
                              >
                                {filme.title.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className={styles.header__suggestionContent}>
                          <span className={styles.header__suggestionTitle}>
                            {filme.title}
                          </span>
                          <span className={styles.header__suggestionMeta}>
                            {filme.release_date?.slice(0, 4) || "Sem data"}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className={styles.header__suggestionState}>
                      Nenhuma sugestão encontrada.
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              className={styles.header__searchButton}
              onClick={handleSearchButtonClick}
              aria-label={isSearchOpen ? "Pesquisar filme" : "Abrir busca"}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={styles.header__searchIcon}
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l5 5" />
              </svg>
            </button>
          </form>

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
