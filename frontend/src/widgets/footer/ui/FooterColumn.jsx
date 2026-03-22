import { NavLink } from 'react-router-dom';
import styles from './Footer.module.css';

export const FooterColumn = ({ title, links }) => {
    return (
        <div className={styles.footerColumn}>
            <h5 className={styles.columnTitle}>{title}</h5>
            <ul className={styles.columnList}>
                {links.map(({ label, href, external }) => (
                    <li key={href} className={styles.columnItem}>
                        {external ? (
                            <a
                                href={href}
                                className={styles.columnLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {label}
                            </a>
                        ) : (
                            <NavLink to={href} className={styles.columnLink}>
                                {label}
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};