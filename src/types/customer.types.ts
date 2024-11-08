// Базовый интерфейс заказчика
export interface ICustomer {
  id: number;
  login: string;
  polnoeImya: string | null;
  foto?: string | null;
}

// DTO для создания заказчика
export interface CreateCustomerDto {
  login: string;
  parol: string;
  polnoeImya?: string;
}

// Тип для формы создания заказчика
export interface CustomerFormData {
  login: string;
  parol: string;
  polnoeImya: string;
}

// Тип для ответа от сервера при создании заказчика
export interface CustomerResponse extends ICustomer {
  message?: string;
} 