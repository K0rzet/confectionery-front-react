import { FC, useEffect, useState } from 'react';
import { OrdersService } from '@/services/orders.service';
import { IOrder } from '@/types/order.types';
import OrdersList from '@/components/OrdersList/OrdersList';

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await OrdersService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <OrdersList 
      orders={orders}
      refetchOrders={fetchOrders}
    />
  );
};

export default OrdersPage; 