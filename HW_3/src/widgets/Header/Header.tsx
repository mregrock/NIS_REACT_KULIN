import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/model/authSlice';
import { Button } from '../../shared/ui/Button/Button';
import styles from './Header.module.css';

export const Header: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>E-Commerce Admin</div>
      <div className={styles.user}>
        {user && (
          <>
            <img src={user.image} alt={user.username} className={styles.avatar} />
            <span className={styles.username}>{user.username}</span>
          </>
        )}
        <Button variant="outline" onClick={handleLogout} className={styles.logoutBtn}>
          {t('nav.logout')}
        </Button>
      </div>
    </header>
  );
};
