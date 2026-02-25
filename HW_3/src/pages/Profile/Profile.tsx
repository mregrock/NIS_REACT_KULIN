import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';
import { Card } from '../../shared/ui/Card/Card';
import styles from './Profile.module.css';

export const Profile: FC = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('profile.title')}</h1>
      <Card className={styles.card}>
        <div className={styles.header}>
          <img src={user.image} alt={user.username} className={styles.avatar} />
          <div className={styles.info}>
            <h2 className={styles.name}>{user.firstName} {user.lastName}</h2>
            <p className={styles.username}>@{user.username}</p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.label}>{t('profile.email')}:</span>
            <span className={styles.value}>{user.email}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Gender:</span>
            <span className={styles.value}>{user.gender}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
