import { axiosClassic } from "@/api/axios";
import {
  IEquipment,
  IEquipmentFailure,
  IFailureReason,
} from "@/types/equipment.types";

class EquipmentService {
  private _BASE_URL = "/equipment";

  // Базовые операции с оборудованием
  async fetchAll() {
    return axiosClassic.get(this._BASE_URL);
  }

  async fetchById(id: number) {
    return axiosClassic.get(`${this._BASE_URL}/${id}`);
  }

  async create(data: Partial<IEquipment>) {
    return axiosClassic.post(this._BASE_URL, data);
  }

  async update(id: number, data: Partial<IEquipment>) {
    return axiosClassic.put(`${this._BASE_URL}/${id}`, data);
  }

  async delete(id: number) {
    return axiosClassic.delete(`${this._BASE_URL}/${id}`);
  }

  async fetchEquipmentWithInfo() {
    return axiosClassic.get(`${this._BASE_URL}/info`);
  }

  // Методы для работы со сбоями
  async getFailures(params?: {
    skip?: number;
    take?: number;
    oborudovanieId?: number;
    masterId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<IEquipmentFailure[]> {
    const { data } = await axiosClassic.get(`${this._BASE_URL}/failures`, {
      params,
    });
    return data;
  }

  async createFailure(failureData: {
    oborudovanieId: number;
    prichinaId: number;
    masterId: number;
    vremyaNachala: Date;
    kommentariy?: string;
  }): Promise<IEquipmentFailure> {
    const { data } = await axiosClassic.post(
      `${this._BASE_URL}/failures`,
      failureData
    );
    return data;
  }

  async completeFailure(
    id: number,
    vremyaOkonchaniya: Date
  ): Promise<IEquipmentFailure> {
    const { data } = await axiosClassic.patch(
      `${this._BASE_URL}/failures/${id}/complete`,
      {
        vremyaOkonchaniya,
      }
    );
    return data;
  }

  // Методы для работы с причинами сбоев
  async getFailureReasons(): Promise<IFailureReason[]> {
    const { data } = await axiosClassic.get(
      `${this._BASE_URL}/failure-reasons`
    );
    return data;
  }

  // Получение списка оборудования с параметрами
  async getEquipment(params: {
    skip?: number;
    take?: number;
    tipOborudovaniyaId?: number;
  }): Promise<IEquipment[]> {
    const { data } = await axiosClassic.get(this._BASE_URL, { params });
    return data;
  }
}

export default new EquipmentService();
