import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { OrdersService, translateStatus } from '@/services/orders.service';
import { 
  IOrder, 
  OrderStatus, 
  CreateOrderDto, 
  IUser 
} from '@/types/order.types';
import styles from './OrdersList.module.scss';
import { Modal } from '../ui/Modal/Modal';
import CostEstimation from '../CostEstimation/CostEstimation';

interface OrdersListProps {
  orders: IOrder[];
  refetchOrders: () => void;
}

// Добавляем интерфейс для ошибок валидации
interface ValidationErrors {
  nazvanieZakaza?: string;
  zakazchikId?: string;
  opisanieIzdeliya?: string;
  razmeryIzdeliya?: string;
  razmeryIzdeliyaFields?: { 
    nazvanie?: string;
    znachenie?: string;
    edinitsaIzmereniya?: string;
  }[];
  primeryRabot?: string;
}

const OrdersList: FC<OrdersListProps> = ({ orders, refetchOrders }) => {
  const { user } = useProfile();
  const navigate = useNavigate();
  
  // Состояния для фильтров и модальных окон
  const [filter, setFilter] = useState<'new' | 'completed' | 'current' | 'rejected' | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [specificationModalOpen, setSpecificationModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    stoimost: '',
    planovayaDataZaversheniya: ''
  });
  const [newOrder, setNewOrder] = useState<CreateOrderDto>({
    nazvanieZakaza: '',
    izdelieId: 0,
    opisanieIzdeliya: '',
    razmeryIzdeliya: [],
    primeryRabot: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Добавим состояние для хранения списка заказчиков (для менеджера)
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  // Добавляем состояние для ошибок
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Добавляем новое состояние для модального окна оценки затрат
  const [costEstimationModalOpen, setCostEstimationModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Загрузка списка заказчиков при открытии модального окна
  useEffect(() => {
    if (createModalOpen && user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) {
      OrdersService.getCustomers().then(setCustomers);
    }
  }, [createModalOpen, user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI]);

  // Обработчики действий
  const handleStatusChange = async (order: IOrder, newStatus: OrderStatus, additionalData = {}) => {
    try {
      await OrdersService.updateOrderStatus(order.id, newStatus, additionalData);
      refetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder) return;
    await handleStatusChange(selectedOrder, OrderStatus.OTMENEN, {
      prichina_otkaza: rejectReason
    });
    setRejectModalOpen(false);
    setSelectedOrder(null);
    setRejectReason('');
  };

  const handleSpecificationComplete = async () => {
    if (!selectedOrder) return;
    await handleStatusChange(selectedOrder, OrderStatus.PODTVERZHDENIE, {
      stoimost: Number(orderDetails.stoimost),
      planovayaDataZaversheniya: orderDetails.planovayaDataZaversheniya
    });
    setSpecificationModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails({ stoimost: '', planovayaDataZaversheniya: '' });
  };

  const handleCreateOrder = async () => {
    try {
      // Валидация обязательных полей
      if (!newOrder.nazvanieZakaza || !newOrder.izdelieId || newOrder.razmeryIzdeliya.length === 0) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Если пользователь - менеджер, проверяем наличие заказчика
      if (user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI && !newOrder.zakazchikId) {
        alert('Необходимо выбрать заказчика');
        return;
      }

      // Загрузка изображений
      const uploadedImages: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          const uploadPromises = selectedFiles.map(file => OrdersService.uploadFile(file));
          const results = await Promise.all(uploadPromises);
          uploadedImages.push(...results.map(result => result.path));
        } catch (error) {
          console.error('Error uploading files:', error);
          alert('Ошибка при загрузке изображений');
          return;
        }
      }

      // Создание заказа
      const orderData: CreateOrderDto = {
        ...newOrder,
        primeryRabot: uploadedImages
      };

      await OrdersService.createOrder(orderData);

      // Сброс формы
      setCreateModalOpen(false);
      setNewOrder({
        nazvanieZakaza: '',
        izdelieId: 0,
        opisanieIzdeliya: '',
        razmeryIzdeliya: [],
        primeryRabot: []
      });
      setSelectedFiles([]);
      refetchOrders();

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа');
    }
  };

  const renderActionButtons = (order: IOrder) => {
    // Для заказчика
    if (user.isZakazchik) {
      if (order.zakazchik.login === user.login) {
        switch (order.status) {
          case OrderStatus.NOVYY:
            return (
              <>
                <button 
                  onClick={() => handleStatusChange(order, OrderStatus.OTMENEN)}
                  className={styles.rejectButton}
                >
                  Отменить
                </button>
                <button
                  onClick={() => OrdersService.deleteOrder(order.id).then(refetchOrders)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </>
            );
          case OrderStatus.SOSTAVLENIE_SPETSIFIKATSII:
          case OrderStatus.PODTVERZHDENIE:
            return (
              <button 
                onClick={() => handleStatusChange(order, OrderStatus.OTMENEN)}
                className={styles.rejectButton}
              >
                Отменить
              </button>
            );
        }
      }
    }

    // Для менеджера по работе с клиентами
    if (user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) {
      switch (order.status) {
        case OrderStatus.NOVYY:
          return (
            <>
              <button 
                onClick={() => handleStatusChange(order, OrderStatus.SOSTAVLENIE_SPETSIFIKATSII)}
                className={styles.acceptButton}
              >
                Принять заказ
              </button>
              <button 
                onClick={() => {
                  setSelectedOrder(order);
                  setRejectModalOpen(true);
                }}
                className={styles.rejectButton}
              >
                Отклонить
              </button>
              
            </>
          );
        case OrderStatus.SOSTAVLENIE_SPETSIFIKATSII:
          return (
            <button 
              onClick={() => {
                setSelectedOrder(order);
                setSpecificationModalOpen(true);
              }}
              className={styles.confirmButton}
            >
              Завершить спецификацию
            </button>
          );
        case OrderStatus.PODTVERZHDENIE:
          return (
            <>
              <button 
                onClick={() => handleStatusChange(order, OrderStatus.ZAKUPKA)}
                className={styles.proceedButton}
              >
                В закупку
              </button>
              <button 
                onClick={() => {
                  setSelectedOrder(order);
                  setRejectModalOpen(true);
                }}
                className={styles.rejectButton}
              >
                Отклонить
              </button>
              {order.status === OrderStatus.PODTVERZHDENIE && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setCostEstimationModalOpen(true);
                    }}
                    className={styles.estimationButton}
                  >
                    📊 Оценка затрат и сроков
                  </button>
                </div>
              )}
            </>
          );
        case OrderStatus.GOTOV:
          return (
            <button 
              onClick={() => handleStatusChange(order, OrderStatus.VYPOLNEN)}
              className={styles.completeButton}
            >
              Выполнен
            </button>
          );
      }
    }

    // Для менеджера по закупкам
    if (user.isMenedzerPoZakupkam && order.status === OrderStatus.ZAKUPKA) {
      return (
        <button 
          onClick={() => handleStatusChange(order, OrderStatus.PROIZVODSTVO)}
          className={styles.productionButton}
        >
          В производство
        </button>
      );
    }

    // Для мастера
    if (user.isMaster) {
      switch (order.status) {
        case OrderStatus.PROIZVODSTVO:
          return (
            <button 
              onClick={() => handleStatusChange(order, OrderStatus.KONTROL)}
              className={styles.controlButton}
            >
              На контроль
            </button>
          );
        case OrderStatus.KONTROL:
          return (
            <button 
              onClick={() => handleStatusChange(order, OrderStatus.GOTOV)}
              className={styles.readyButton}
            >
              Готов
            </button>
          );
      }
    }

    return null;
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    // Фильтрация по роли
    if (user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) {
      if (!(order.status === OrderStatus.NOVYY || 
            order.otvetstvennyyMenedzher?.login === user.login)) {
        return false;
      }
    }

    if (user.isZakazchik) {
      if (order.zakazchik.login !== user.login) {
        return false;
      }
    }

    if (user.isMenedzerPoZakupkam) {
      if (order.status !== OrderStatus.ZAKUPKA) {
        return false;
      }
    }

    if (user.isMaster) {
      if (![OrderStatus.PROIZVODSTVO, OrderStatus.KONTROL].includes(order.status)) {
        return false;
      }
    }

    // Фильтрация по статусу
    if (!filter) return true;
    
    switch (filter) {
      case 'new':
        return [OrderStatus.NOVYY, OrderStatus.SOSTAVLENIE_SPETSIFIKATSII, OrderStatus.PODTVERZHDENIE].includes(order.status);
      case 'completed':
        return [OrderStatus.GOTOV, OrderStatus.VYPOLNEN].includes(order.status);
      case 'current':
        return [OrderStatus.ZAKUPKA, OrderStatus.PROIZVODSTVO, OrderStatus.KONTROL].includes(order.status);
      case 'rejected':
        return order.status === OrderStatus.OTMENEN;
      default:
        return true;
    }
  });

  // Функция валидации формы
  const validateForm = () => {
    const errors: ValidationErrors = {};

    // Валидация названия заказа
    if (!newOrder.nazvanieZakaza.trim()) {
      errors.nazvanieZakaza = 'Название заказа обязательно';
    }

    // Валидация заказчика (только для менеджера)
    if (user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI && !newOrder.zakazchikId) {
      errors.zakazchikId = 'Необходимо выбрать заказчика';
    }

    // Расширенная валидация размеров изделия
    if (!newOrder.razmeryIzdeliya || newOrder.razmeryIzdeliya.length === 0) {
      errors.razmeryIzdeliya = 'Добавьте хотя бы один размер изделия';
    } else {
      const razmeryErrors: { 
        nazvanie?: string;
        znachenie?: string;
        edinitsaIzmereniya?: string;
      }[] = [];

      newOrder.razmeryIzdeliya.forEach((razmer, index) => {
        const razmerError: {
          nazvanie?: string;
          znachenie?: string;
          edinitsaIzmereniya?: string;
        } = {};

        if (!razmer.nazvanie.trim()) {
          razmerError.nazvanie = 'Укажите название замера';
        }

        if (!razmer.znachenie || razmer.znachenie <= 0) {
          razmerError.znachenie = 'Значение должно быть больше 0';
        }

        if (!razmer.edinitsaIzmereniya.trim()) {
          razmerError.edinitsaIzmereniya = 'Укажите единицу измерения';
        }

        if (Object.keys(razmerError).length > 0) {
          razmeryErrors[index] = razmerError;
        }
      });

      if (razmeryErrors.some(error => error !== undefined)) {
        errors.razmeryIzdeliyaFields = razmeryErrors;
      }
    }

    // Валидация описания (опционально, но если есть, должно быть не пустым)
    if (newOrder.opisanieIzdeliya && !newOrder.opisanieIzdeliya.trim()) {
      errors.opisanieIzdeliya = 'Описание изделия не может быть пустым';
    }

    // Валидация примеров работ (опционально)
    if (selectedFiles.length > 0) {
      const invalidFiles = selectedFiles.some(file => {
        const fileType = file.type.toLowerCase();
        return !fileType.startsWith('image/');
      });

      if (invalidFiles) {
        errors.primeryRabot = 'Можно загружать только изображения';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0 && !errors.razmeryIzdeliyaFields;
  };

  // Обновляем обработчики изменения полей
  const handleInputChange = (field: keyof CreateOrderDto, value: any) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для измененного поля
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          {(user.isZakazchik || user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) && (
            <button 
              onClick={() => setCreateModalOpen(true)}
              className={styles.createButton}
            >
              Создать заказ
            </button>
          )}
          <div className={styles.filters}>
            <button onClick={() => setFilter(null)} className={filter === null ? styles.activeFilter : ''}>
              Все
            </button>
            <button onClick={() => setFilter('new')} className={filter === 'new' ? styles.activeFilter : ''}>
              Новые
            </button>
            <button onClick={() => setFilter('current')} className={filter === 'current' ? styles.activeFilter : ''}>
              Текущие
            </button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? styles.activeFilter : ''}>
              Выполненные
            </button>
            <button onClick={() => setFilter('rejected')} className={filter === 'rejected' ? styles.activeFilter : ''}>
              Отклоненные
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Номер и дата</th>
              <th>Название</th>
              <th>Статус</th>
              <th>Стоимость</th>
              <th>Заказчик</th>
              <th>Плановая дата</th>
              <th>Менеджер</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{`${order.nomer} от ${new Date(order.data).toLocaleDateString()}`}</td>
                <td>{order.nazvanieZakaza}</td>
                <td>{translateStatus(order.status)}</td>
                <td>{order.stoimost || '-'}</td>
                <td>{order.zakazchik.login}</td>
                <td>{order.planovayaDataZaversheniya ? new Date(order.planovayaDataZaversheniya).toLocaleDateString() : '-'}</td>
                <td>{order.otvetstvennyyMenedzher?.login || '-'}</td>
                <td>
                  {(user.isDIREKTOR || user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI) && (
                    <button
                      onClick={() => navigate(`/orders/${order.id}/history`)}
                      className={styles.historyButton}
                    >
                      История
                    </button>
                  )}
                  {renderActionButtons(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно отклонения заказа */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
        <h3>Укажите причину отклонения</h3>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleReject} className={styles.submitButton}>
          Отклонить заказ
        </button>
      </Modal>

      {/* Модальное окно завершения спецификации */}
      <Modal isOpen={specificationModalOpen} onClose={() => setSpecificationModalOpen(false)}>
        <h3>Завершение спецификации</h3>
        <div className={styles.formGroup}>
          <input
            type="number"
            value={orderDetails.stoimost}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, stoimost: e.target.value }))}
            placeholder="Стоимость"
            className={styles.input}
          />
          <input
            type="date"
            value={orderDetails.planovayaDataZaversheniya}
            onChange={(e) => setOrderDetails(prev => ({ ...prev, planovayaDataZaversheniya: e.target.value }))}
            className={styles.input}
          />
          <button onClick={handleSpecificationComplete} className={styles.submitButton}>
            Подтвердить
          </button>
        </div>
      </Modal>

      {/* Модальное окно создания заказа */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <h3>Создание нового заказа</h3>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={newOrder.nazvanieZakaza}
              onChange={(e) => handleInputChange('nazvanieZakaza', e.target.value)}
              placeholder="Название заказа *"
              className={`${styles.input} ${validationErrors.nazvanieZakaza ? styles.errorInput : ''}`}
            />
            {validationErrors.nazvanieZakaza && (
              <span className={styles.errorMessage}>{validationErrors.nazvanieZakaza}</span>
            )}
          </div>

          {user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI && (
            <div className={styles.inputWrapper}>
              <select
                value={selectedCustomer || ''}
                onChange={(e) => {
                  const customerId = Number(e.target.value);
                  setSelectedCustomer(customerId);
                  handleInputChange('zakazchikId', customerId);
                }}
                className={`${styles.select} ${validationErrors.zakazchikId ? styles.errorInput : ''}`}
              >
                <option value="">Выберите заказчика *</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.polnoeImya || customer.login}
                  </option>
                ))}
              </select>
              {validationErrors.zakazchikId && (
                <span className={styles.errorMessage}>{validationErrors.zakazchikId}</span>
              )}
            </div>
          )}

          {/* Информация об ответственном менеджере (для заказчика) */}
          {user.isZakazchik && selectedOrder && (
            <div className={styles.managerInfo}>
              <label>Ответственный менеджер:</label>
              <span>
                {selectedOrder.otvetstvennyyMenedzher?.polnoeImya || 
                 selectedOrder.otvetstvennyyMenedzher?.login}
              </span>
            </div>
          )}

          {/* Дата заказа (неизменяемая) */}
          <div className={styles.orderDate}>
            <label>Дата заказа:</label>
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          {/* Остальные поля формы */}
          <input
            type="number"
            value={newOrder.izdelieId || ''}
            onChange={(e) => setNewOrder(prev => ({ 
              ...prev, 
              izdelieId: Number(e.target.value) 
            }))}
            placeholder="ID изделия *"
            className={styles.input}
            required
          />

          <textarea
            value={newOrder.opisanieIzdeliya || ''}
            onChange={(e) => handleInputChange('opisanieIzdeliya', e.target.value)}
            placeholder="Описание изделия"
            className={`${styles.textarea} ${validationErrors.opisanieIzdeliya ? styles.errorInput : ''}`}
          />
          {validationErrors.opisanieIzdeliya && (
            <span className={styles.errorMessage}>{validationErrors.opisanieIzdeliya}</span>
          )}

          {/* Размеры изделия */}
          <div className={`${styles.sizes} ${validationErrors.razmeryIzdeliya ? styles.errorSection : ''}`}>
            <h4>Размеры изделия *</h4>
            {validationErrors.razmeryIzdeliya && (
              <span className={styles.errorMessage}>{validationErrors.razmeryIzdeliya}</span>
            )}
            {newOrder.razmeryIzdeliya.map((razmer, index) => (
              <div key={index} className={styles.sizeRow}>
                <input
                  type="text"
                  value={razmer.nazvanie}
                  onChange={(e) => {
                    const newRazmery = [...newOrder.razmeryIzdeliya];
                    newRazmery[index].nazvanie = e.target.value;
                    setNewOrder(prev => ({ ...prev, razmeryIzdeliya: newRazmery }));
                  }}
                  placeholder="Название замера"
                  required
                />
                <input
                  type="number"
                  value={razmer.znachenie}
                  onChange={(e) => {
                    const newRazmery = [...newOrder.razmeryIzdeliya];
                    newRazmery[index].znachenie = Number(e.target.value);
                    setNewOrder(prev => ({ ...prev, razmeryIzdeliya: newRazmery }));
                  }}
                  placeholder="Значение"
                  required
                />
                <input
                  type="text"
                  value={razmer.edinitsaIzmereniya}
                  onChange={(e) => {
                    const newRazmery = [...newOrder.razmeryIzdeliya];
                    newRazmery[index].edinitsaIzmereniya = e.target.value;
                    setNewOrder(prev => ({ ...prev, razmeryIzdeliya: newRazmery }));
                  }}
                  placeholder="Единица измерения"
                  required
                />
                <button 
                  onClick={() => {
                    const newRazmery = newOrder.razmeryIzdeliya.filter((_, i) => i !== index);
                    setNewOrder(prev => ({ ...prev, razmeryIzdeliya: newRazmery }));
                  }}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            ))}
            <button 
              onClick={() => {
                setNewOrder(prev => ({
                  ...prev,
                  razmeryIzdeliya: [
                    ...prev.razmeryIzdeliya,
                    { nazvanie: '', znachenie: 0, edinitsaIzmereniya: '' }
                  ]
                }));
              }}
              className={styles.addButton}
            >
              Добавить размер
            </button>
          </div>

          {/* Загрузка примеров работ */}
          <div className={styles.fileUpload}>
            <h4>Примеры работ</h4>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles(files);
              }}
              className={styles.fileInput}
            />
          </div>

          <button 
            onClick={() => {
              if (validateForm()) {
                handleCreateOrder();
              }
            }}
            className={styles.submitButton}
          >
            Создать заказ
          </button>
        </div>
      </Modal>

      {/* Модальное окно оценки затрат */}
      <Modal 
        isOpen={costEstimationModalOpen} 
        onClose={() => {
          setCostEstimationModalOpen(false);
          setSelectedOrderId(null);
        }}
      >
        <div className={styles.costEstimationModal}>
          <h3>Оценка затрат и сроков доставки</h3>
          {selectedOrderId && (
            <CostEstimation zakazId={selectedOrderId} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default OrdersList; 