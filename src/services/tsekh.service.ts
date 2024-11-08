import { Tsekh, Marker } from '@/types/tsekh.types';
import { axiosClassic } from '@/api/axios';

const API_URL = '/tsekhi';

export const tsekhService = {
  async poluchitTsekhi() {
    const { data } = await axiosClassic.get<Tsekh[]>(API_URL);
    return data;
  },

  async poluchitTsekhSMarkerami(id: number) {
    const { data } = await axiosClassic.get<Tsekh>(`${API_URL}/${id}`);
    return data;
  },

  async dobavitMarker(tsekhId: number, marker: Omit<Marker, 'id' | 'tsekhId'>) {
    const { data } = await axiosClassic.post<Marker>(`${API_URL}/${tsekhId}/markery`, marker);
    return data;
  },

  async obnovitMarker(tsekhId: number, markerId: number, marker: Pick<Marker, 'x' | 'y' | 'povorot'>) {
    const { data } = await axiosClassic.put<Marker>(`${API_URL}/${tsekhId}/markery/${markerId}`, marker);
    return data;
  },

  async udalitMarker(tsekhId: number, markerId: number) {
    await axiosClassic.delete(`${API_URL}/${tsekhId}/markery/${markerId}`);
  }
}; 