import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "shared/lib/navigation";
import { SearchIcon } from "shared/assets/icons/SearchIcon";
import logo from "shared/assets/images/logo/logo_black.png";
import styles from "./Header.module.css";
import clsx from "clsx";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef(null);
  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setSearchQuery("");
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Адреса Бенуа" className={styles.logo} />
        </div>

        <div
          className={clsx(styles.navCollapse, {
            [styles.show]: isNavOpen,
          })}
        >
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ href, label, className }) => (
              <li key={href} className={styles.navItem}>
                <NavLink
                  to={href}
                  className={({ isActive }) =>
                    `${styles.navLink} ${className ? styles[className] : ""} ${isActive ? styles.active : ""}`
                  }
                  onClick={closeNav}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          className={clsx(styles.burgerButton, { [styles.open]: isNavOpen })}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label={isNavOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isNavOpen}
        >
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
          <span className={styles.burgerLine} />
        </button>

        <div className={styles.searchContainer}>
          <div
            className={`
            ${styles.searchWrapper}
            ${isSearchOpen ? styles.searchOpen : ""}
          `}
          >
            <div
              className={`
              ${styles.searchInputContainer}
              ${isSearchOpen ? styles.searchInputVisible : ""}
            `}
            >
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className={styles.searchInput}
              />
            </div>

            <button
              onClick={handleToggleSearch}
              className={styles.searchButton}
              aria-label="Открыть поиск"
            >
              <SearchIcon className={styles.searchIcon} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
