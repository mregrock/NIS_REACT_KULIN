import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../entities/product/api/productsApi';
import { ProductCard } from '../../entities/product/ui/ProductCard/ProductCard';
import { Input } from '../../shared/ui/Input/Input';
import { Loader } from '../../shared/ui/Loader/Loader';
import { useDebounce } from '../../shared/lib/hooks/useDebounce';
import { useAppSelector } from '../../app/hooks';
import styles from './Products.module.css';

export const Products: FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(search, 500);
  const { pageSize } = useAppSelector((state) => state.settings);
  
  const page = Number(searchParams.get('page')) || 1;
  const skip = (page - 1) * pageSize;

  const { data, isLoading, isError } = useGetProductsQuery({
    limit: pageSize,
    skip,
    q: debouncedSearch,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setSearchParams({ q: value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: search, page: String(newPage) });
  };

  if (isLoading) return <Loader />;
  if (isError) return <div className={styles.error}>{t('products.error')}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('products.title')}</h1>
        <Input
          placeholder={t('products.search')}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {data?.products.length === 0 ? (
        <div className={styles.empty}>{t('products.empty')}</div>
      ) : (
        <>
          <div className={styles.grid}>
            {data?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className={styles.pageBtn}
            >
              ←
            </button>
            <span className={styles.pageInfo}>{page}</span>
            <button
              disabled={!data || data.total <= skip + pageSize}
              onClick={() => handlePageChange(page + 1)}
              className={styles.pageBtn}
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
};
