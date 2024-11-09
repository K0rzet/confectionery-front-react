import { axiosClassic } from "@/api/axios";

export interface Operation {
  id: string;
  operatsiya: string;
  polufabrikat: string;
  start: Date;
  end: Date;
  tipOborudovaniya: string;
  oborudovanieId: number;
}

export interface Equipment {
  id: number;
  nazvanie: string;
  tipOborudovaniya: string;
  operations: Operation[];
}

export interface GanttChartData {
  equipment: Equipment[];
  startDate: string;
  endDate: string;
}

class GanttChartService {
  async fetchGanttData(zakazId: number): Promise<GanttChartData> {
    try {
      const { data } = await axiosClassic.get<GanttChartData>(`/cost-estimation/gantt-chart/${zakazId}`);
      return data;
    } catch (error) {
      console.error('Error fetching Gantt chart data:', error);
      throw error;
    }
  }
}

export const ganttChartService = new GanttChartService(); 