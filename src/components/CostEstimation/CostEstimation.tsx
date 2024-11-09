import { useEffect, useState, FC } from 'react'
import { CostEstimationResponseDto, MaterialNeedDto } from '@/types/cost-estimation.types'
import costEstimationService from '@/services/cost-estimation.service'
import styles from './CostEstimation.module.scss'

interface CostEstimationProps {
  zakazId: number
}

const CostEstimation: FC<CostEstimationProps> = ({ zakazId }) => {
  const [estimation, setEstimation] = useState<CostEstimationResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEstimation()
  }, [zakazId])

  const loadEstimation = async () => {
    try {
      setIsLoading(true)
      const data = await costEstimationService.getOrderEstimation(zakazId)
      setEstimation(data)
    } catch (error) {
      setError('Ошибка при загрузке оценки затрат')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!estimation) return null

  const MaterialsTable = ({ materials, title }: { materials: MaterialNeedDto[], title: string }) => (
    <div className={styles.materialsSection}>
      <h3>{title}</h3>
      <table className={styles.materialsTable}>
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Название</th>
            <th>Требуемое кол-во</th>
            <th>Имеющееся кол-во</th>
            <th>Недостающее кол-во</th>
            <th>Закупочная цена</th>
            <th>Себестоимость</th>
            <th>Время доставки</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.artikul}>
              <td>{material.artikul}</td>
              <td>{material.nazvanie}</td>
              <td>{material.trebuemoeKolichestvo} {material.edinitsaIzmereniya}</td>
              <td>{material.imeyushcheyesyaKolichestvo} {material.edinitsaIzmereniya}</td>
              <td className={material.nedostayushcheeKolichestvo > 0 ? styles.warning : ''}>
                {material.nedostayushcheeKolichestvo} {material.edinitsaIzmereniya}
              </td>
              <td>{material.zakupochnayaTsena} ₽</td>
              <td>{material.sebestoimost} ₽</td>
              <td>{material.vremyaDostavki} дней</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className={styles.container}>
      <h2>Оценка затрат и сроков доставки</h2>
      
      <MaterialsTable materials={estimation.ingredienty} title="Ингредиенты" />
      <MaterialsTable materials={estimation.ukrasheniya} title="Украшения" />
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Общая себестоимость:</span>
          <strong>{estimation.obshchayaSebestoimost} ₽</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Минимальное время доставки:</span>
          <strong>{estimation.minimalnoVremyaDostavki} дней</strong>
        </div>
      </div>
    </div>
  )
} 

export default CostEstimation