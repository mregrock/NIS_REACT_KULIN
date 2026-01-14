import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: {
          messages_one: 'У вас {{count}} непрочитанное сообщение',
          messages_few: 'У вас {{count}} непрочитанных сообщения',
          messages_many: 'У вас {{count}} непрочитанных сообщений',
          lastMessageDate: 'Последнее сообщение: {{date, datetime}}'
        }
      }
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'datetime' && value instanceof Date) {
          return new Intl.DateTimeFormat(lng, {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(value);
        }
        return value;
      }
    }
  });

export default i18n;
