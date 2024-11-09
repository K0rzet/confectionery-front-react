import { axiosClassic } from "@/api/axios"
import { ISpecification, UpdateSpecificationDto } from "@/types/specification.types"

class SpecificationService {
  private BASE_URL = '/specifications'

  async getSpecification(izdelieId: number): Promise<ISpecification> {
    const { data } = await axiosClassic.get(`${this.BASE_URL}/izdelie/${izdelieId}`)
    return data
  }

  async updateSpecification(izdelieId: number, dto: UpdateSpecificationDto) {
    const { data } = await axiosClassic.put(`${this.BASE_URL}/izdelie/${izdelieId}`, dto)
    return data
  }

  async getAvailableIngredients() {
    const { data } = await axiosClassic.get(`${this.BASE_URL}/ingredients`)
    return data
  }

  async getAvailableDecorations() {
    const { data } = await axiosClassic.get(`${this.BASE_URL}/decorations`)
    return data
  }

  async getAvailableSemifinished() {
    const { data } = await axiosClassic.get(`${this.BASE_URL}/semifinished`)
    return data
  }

  async uploadImages(izdelieId: number, files: File[]) {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    const { data } = await axiosClassic.post(
      `${this.BASE_URL}/izdelie/${izdelieId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    console.log('Upload response:', data)
    return data
  }

  async deleteImages(izdelieId: number, urls: string[]) {
    const { data } = await axiosClassic.delete(
      `${this.BASE_URL}/izdelie/${izdelieId}/images`,
      { data: { urls } }
    )
    return data
  }
}

export default new SpecificationService() 