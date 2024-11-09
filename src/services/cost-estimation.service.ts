import { axiosClassic } from '@/api/axios'
import { CostEstimationResponseDto } from '@/types/cost-estimation.types'

class CostEstimationService {
  private BASE_URL = '/cost-estimation'

  async getOrderEstimation(zakazId: number) {
    const { data } = await axiosClassic.get<CostEstimationResponseDto>(
      `${this.BASE_URL}/zakaz/${zakazId}`
    )
    return data
  }
}

export default new CostEstimationService() 