import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../lib/constants';
import logo from 'shared/assets/images/logo/logo_black.png';
import styles from './Header.module.css';

export const Header = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const closeNav = () => setIsNavOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>

        <div className={styles.navbarLogo}>
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

      </div>
    </nav>
  );
};
