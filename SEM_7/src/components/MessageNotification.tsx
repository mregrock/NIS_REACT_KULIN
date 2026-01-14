import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/MessageNotification.css';

const MessageNotification: React.FC = () => {
  const { t } = useTranslation();
  const [count, setCount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 10) + 1;
    setCount(randomCount);
    setDate(new Date());
  }, []);

  return (
    <div className="notification-container">
      <h1 className="notification-title">
        {t('messages', { count })}
      </h1>
      <p className="notification-date">
        ({t('lastMessageDate', { date })})
      </p>
    </div>
  );
};

export default MessageNotification;
