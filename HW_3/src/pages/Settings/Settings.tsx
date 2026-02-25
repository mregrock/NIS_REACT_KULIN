import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLanguage, setPageSize, setTheme } from '../../features/settings/model/settingsSlice';
import { Card } from '../../shared/ui/Card/Card';
import { Select } from '../../shared/ui/Select/Select';
import styles from './Settings.module.css';

export const Settings: FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme, language, pageSize } = useAppSelector((state) => state.settings);

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang as 'ru' | 'en'));
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (newTheme: string) => {
    dispatch(setTheme(newTheme as 'light' | 'dark'));
  };

  const handlePageSizeChange = (size: string) => {
    dispatch(setPageSize(Number(size)));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('settings.title')}</h1>
      <Card className={styles.card}>
        <div className={styles.section}>
          <Select
            label={t('settings.language')}
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            options={[
              { value: 'ru', label: t('settings.ru') },
              { value: 'en', label: t('settings.en') },
            ]}
          />
        </div>
        <div className={styles.section}>
          <Select
            label={t('settings.theme')}
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            options={[
              { value: 'light', label: t('settings.light') },
              { value: 'dark', label: t('settings.dark') },
            ]}
          />
        </div>
        <div className={styles.section}>
          <Select
            label={t('settings.pageSize')}
            value={pageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            options={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};
