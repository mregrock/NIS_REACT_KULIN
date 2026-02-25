import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../shared/ui/Card/Card';
import styles from './Dashboard.module.css';

export const Dashboard: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('nav.dashboard')}</h1>
      <div className={styles.grid}>
        <Card className={styles.card}>
          <h3>{t('products.title')}</h3>
          <p>100+</p>
        </Card>
        <Card className={styles.card}>
          <h3>{t('nav.profile')}</h3>
          <p>Admin</p>
        </Card>
      </div>
    </div>
  );
};
