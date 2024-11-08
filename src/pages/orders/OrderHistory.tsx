import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrdersService } from '@/services/orders.service';
import { useProfile } from '@/hooks/useProfile';
import styles from './OrderHistory.module.scss';

interface IOrderHistory {
  id: number;
  status: string;
  data: string;
  polzovatel: {
    polnoeImya: string;
  };
}

const OrderHistory: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useProfile();
  const [history, setHistory] = useState<IOrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Отдельный useEffect для проверки прав доступа
  useEffect(() => {
    if (!user.isDIREKTOR && !user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) {
      navigate('/');
    }
  }, [user, navigate]);

  // Отдельный useEffect для загрузки данных
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await OrdersService.getOrderHistory(Number(id));
        setHistory(data);
      } catch (err) {
        setError('Не удалось загрузить историю заказа');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]); // Убрали user и navigate из зависимостей

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/orders')}
        >
          ← Назад к заказам
        </button>
        <h1>История изменений статуса заказа #{id}</h1>
      </div>
      
      <div className={styles.timeline}>
        {history.map((record) => (
          <div key={record.id} className={styles.timelineItem}>
            <div className={styles.timelinePoint} />
            <div className={styles.timelineContent}>
              <div className={styles.status}>
                {translateStatus(record.status)}
              </div>
              <div className={styles.info}>
                <span className={styles.date}>
                  {new Date(record.data).toLocaleString('ru-RU')}
                </span>
                <span className={styles.user}>
                  {record.polzovatel.polnoeImya}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Функция для перевода статусов на русский язык
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    NOVYY: 'Новый',
    OTMENEN: 'Отменен',
    SOSTAVLENIE_SPETSIFIKATSII: 'Составление спецификации',
    PODTVERZHDENIE: 'Подтверждение',
    ZAKUPKA: 'Закупка',
    PROIZVODSTVO: 'Производство',
    KONTROL: 'Контроль',
    GOTOV: 'Готов',
    VYPOLNEN: 'Выполнен'
  };

  return statusMap[status] || status;
};

export default OrderHistory; 