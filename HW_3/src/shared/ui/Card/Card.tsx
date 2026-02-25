import { type FC, type HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'medium',
  ...props 
}) => {
  return (
    <div 
      className={`${styles.card} ${styles[padding]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
