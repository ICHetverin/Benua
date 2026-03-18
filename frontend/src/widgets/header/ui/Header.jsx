import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/constants';
import { SearchIcon } from 'shared/assets/icons/SearchIcon'
import logo from 'shared/assets/images/logo/logo_black.png';
import styles from './Header.module.css';

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef(null);
  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setSearchQuery('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>

        <div className={styles.logoContainer}>
            <img
            src={logo}
            alt="Адреса Бенуа"
            className={styles.logo}
            />
        </div>

        <div className={`${styles.navCollapse} ${isNavOpen ? styles.show : ''}`}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ path, label, className }) => (
              <li key={path} className={styles.navItem}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${className ? styles[className] : ''} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeNav}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.searchContainer}>
          <div className={`
            ${styles.searchWrapper}
            ${isSearchOpen ? styles.searchOpen : ''}
          `}>

            <div className={`
              ${styles.searchInputContainer}
              ${isSearchOpen ? styles.searchInputVisible : ''}
            `}>
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
