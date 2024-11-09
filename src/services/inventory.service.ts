import { axiosClassic } from "@/api/axios";

export class InventoryService {
  static async getReport(type: string, itemType?: string) {
    const { data } = await axiosClassic.get("/inventory-report", {
      params: {
        type,
        itemType,
      },
    });
    return data;
  }

  static async getItemTypes(type: string) {
    const { data } = await axiosClassic.get("/inventory-report/types", {
      params: { type },
    });
    return data;
  }
}
