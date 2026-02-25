import { type FC, type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../../api/authApi';
import { Input } from '../../../../shared/ui/Input/Input';
import { Button } from '../../../../shared/ui/Button/Button';
import styles from './LoginForm.module.css';

export const LoginForm: FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password }).unwrap();
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{t('login.title')}</h2>
      <Input
        label={t('login.username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label={t('login.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className={styles.error}>{t('login.error')}</div>}
      <Button type="submit" disabled={isLoading} className={styles.button}>
        {isLoading ? t('products.loading') : t('login.submit')}
      </Button>
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
        <p>Demo credentials:</p>
        <p>Username: <strong>user</strong></p>
        <p>Password: <strong>password</strong></p>
        <p style={{ marginTop: '0.5rem' }}>
          Registration is not supported by the API.
          <br />
          This is a UI stub as per requirements.
        </p>
      </div>
    </form>
  );
};
