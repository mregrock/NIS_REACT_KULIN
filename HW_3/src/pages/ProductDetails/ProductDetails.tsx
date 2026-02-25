import { type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetProductByIdQuery } from '../../entities/product/api/productsApi';
import { Button } from '../../shared/ui/Button/Button';
import { Loader } from '../../shared/ui/Loader/Loader';
import styles from './ProductDetails.module.css';

export const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id || '');

  if (isLoading) return <Loader />;
  if (isError || !product) return <div className={styles.error}>{t('products.error')}</div>;

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => navigate(-1)} className={styles.backBtn}>
        ← {t('common.back')}
      </Button>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img src={product.thumbnail} alt={product.title} className={styles.image} />
          <div className={styles.gallery}>
            {product.images.slice(0, 4).map((img, index) => (
              <img key={index} src={img} alt={`${product.title} ${index}`} className={styles.thumb} />
            ))}
          </div>
        </div>
        
        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.meta}>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.rating}>★ {product.rating}</span>
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.priceBlock}>
            <span className={styles.price}>${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className={styles.discount}>-{product.discountPercentage}%</span>
            )}
          </div>
          <div className={styles.stock}>
            Stock: {product.stock}
          </div>
          <Button className={styles.buyBtn}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};
