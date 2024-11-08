import { axiosClassic } from "@/api/axios"
import { CreateParameterDto, IQualityControl, UpdateParameterDto } from "@/types/quality-control.types"

class QualityControlService {
  private BASE_URL = '/quality-control'

  async createQualityControl(zakazId: number): Promise<IQualityControl> {
    const { data } = await axiosClassic.post(`${this.BASE_URL}/${zakazId}`)
    return data
  }

  async addParameter(kontrolId: number, parameterData: CreateParameterDto) {
    const { data } = await axiosClassic.post(
      `${this.BASE_URL}/${kontrolId}/parameters`,
      parameterData
    )
    return data
  }

  async updateParameter(parameterId: number, updateData: UpdateParameterDto) {
    const { data } = await axiosClassic.patch(
      `${this.BASE_URL}/parameters/${parameterId}`,
      updateData
    )
    return data
  }

  async getQualityControl(zakazId: number): Promise<IQualityControl> {
    const { data } = await axiosClassic.get(`${this.BASE_URL}/${zakazId}`)
    return data
  }
}

export default new QualityControlService() 