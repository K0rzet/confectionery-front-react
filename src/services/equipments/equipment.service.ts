import { axiosClassic } from '@/api/axios'

class EquipmentService {
  private _BASE_URL = '/equipment'

  async fetchAll() {
    return axiosClassic.get(this._BASE_URL)
  }

  async fetchById(id: number) {
    return axiosClassic.get(`${this._BASE_URL}/${id}`)
  }

  async create(data: any) {
    return axiosClassic.post(this._BASE_URL, data)
  }

  async update(id: number, data: any) {
    return axiosClassic.put(`${this._BASE_URL}/${id}`, data)
  }

  async delete(id: number) {
    return axiosClassic.delete(`${this._BASE_URL}/${id}`)
  }

  async fetchEquipmentWithInfo() {
    return axiosClassic.get(`${this._BASE_URL}/info`)
  }
}

export default new EquipmentService()
