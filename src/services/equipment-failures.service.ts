import { axiosClassic } from "@/api/axios";

export class EquipmentFailuresService {
  static async getReport(params: {
    startDate: Date;
    endDate: Date;
    format?: 'chart' | 'table';
  }) {
    const { data } = await axiosClassic.get('/equipment-failures/report', {
      params: {
        startDate: params.startDate.toISOString(),
        endDate: params.endDate.toISOString(),
        format: params.format
      }
    });
    return data;
  }
} 