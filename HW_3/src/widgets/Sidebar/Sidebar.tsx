import { type FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Sidebar.module.css';

export const Sidebar: FC = () => {
  const { t } = useTranslation();

  const links = [
    { to: '/', label: t('nav.dashboard') },
    { to: '/products', label: t('nav.products') },
    { to: '/profile', label: t('nav.profile') },
    { to: '/settings', label: t('nav.settings') },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
