import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { tsekhService } from '@/services/tsekh.service';
import { format } from 'date-fns';
import styles from './TsekhiList.module.scss';

export function TsekhiList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tsekhi'],
    queryFn: () => tsekhService.poluchitTsekhi()
  });

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка загрузки данных</div>;
  if (!data || data.length === 0) return <div className={styles.empty}>Список цехов пуст</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Управление цехами</h1>
      </div>
      
      <div className={styles.grid}>
        {data.map((tsekh) => (
          <Link key={tsekh.id} to={`/tsekhi/${tsekh.id}`} className={styles.card}>
            {tsekh.planIzobrazhenie && (
              <img
                src={`${import.meta.env.VITE_SERVER_URL}/uploads${tsekh.planIzobrazhenie}`  }
                alt={`План ${tsekh.nazvanie}`}
                className={styles.cardImage}
              />
            )}
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{tsekh.nazvanie}</h2>
              <div className={styles.cardInfo}>
                <p>Создан: {format(new Date(tsekh.dataSozdaniya), 'dd.MM.yyyy')}</p>
                <p>Обновлен: {format(new Date(tsekh.dataObnovleniya), 'dd.MM.yyyy')}</p>
                <p>Маркеров на плане: {tsekh.markery?.length || 0}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 