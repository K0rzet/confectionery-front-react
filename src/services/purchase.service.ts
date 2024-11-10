import { axiosClassic } from "@/api/axios";

export class PurchaseService {
  static async getReport() {
    const { data } = await axiosClassic.get("/purchase-report");
    return data;
  }
} 