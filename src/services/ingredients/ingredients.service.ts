import { axiosClassic } from "@/api/axios";

class IngredientsService {
  private _BASE_URL = '/ingredients'

  async fetchAll(filter?: { expirationDateStart?: string; expirationDateEnd?: string }) {
    return axiosClassic.get(this._BASE_URL, { params: filter })
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
}

export default new IngredientsService()
