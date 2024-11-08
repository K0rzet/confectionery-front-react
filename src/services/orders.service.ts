import { IOrder, OrderStatus, CreateOrderDto, UpdateOrderStatusDto } from '@/types/order.types';
import { axiosClassic } from '@/api/axios';
import { IUser } from '@/types/types';
import { CreateCustomerDto } from '@/types/customer.types';

export const OrdersService = {
  async getOrders(filter?: string) {
    const { data } = await axiosClassic.get<IOrder[]>('/orders', {
      params: { filter }
    });
    return data;
  },

  async updateOrderStatus(orderId: number, status: OrderStatus, additionalData: Partial<UpdateOrderStatusDto> = {}) {
    const { data } = await axiosClassic.patch<IOrder>(`/orders/${orderId}/status`, {
      status,
      ...additionalData
    });
    return data;
  },

  async deleteOrder(orderId: number) {
    return axiosClassic.delete(`/orders/${orderId}`);
  },

  async getOrderHistory(orderId: number) {
    const { data } = await axiosClassic.get(`/orders/${orderId}/history`);
    return data;
  },

  async createOrder(dto: CreateOrderDto) {
    const { data } = await axiosClassic.post<IOrder>('/orders', dto);
    return data;
  },

  async uploadFile(file: File) {
    if (!file) {
        throw new Error('Файл обязателен для загрузки');
    }
    
    const formData = new FormData();
    formData.append('files', file);
    
    const { data } = await axiosClassic.post<{ path: string }>(
        '/orders/upload-examples', 
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return data;
  },

  async getCustomers() {
    const { data } = await axiosClassic.get<IUser[]>('/users/customers');
    return data;
  },

  async createCustomer(customerData: CreateCustomerDto) {
    const { data } = await axiosClassic.post<IUser>('/users/customers', customerData);
    return data;
  }
};

// Вспомогательные функции
export const translateStatus = (status: string): string => {
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