import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../model/types';
import { Card } from '../../../../shared/ui/Card/Card';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/products/${product.id}`} className={styles.link}>
      <Card className={styles.card} padding="none">
        <div className={styles.imageContainer}>
          <img src={product.thumbnail} alt={product.title} className={styles.image} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.info}>
            <span className={styles.price}>${product.price}</span>
            <span className={styles.rating}>★ {product.rating}</span>
          </div>
          <div className={styles.category}>{product.category}</div>
        </div>
      </Card>
    </Link>
  );
};
