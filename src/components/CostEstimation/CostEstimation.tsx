import { useEffect, useState, FC } from 'react'
import { CostEstimationResponseDto, MaterialNeedDto } from '@/types/cost-estimation.types'
import costEstimationService from '@/services/cost-estimation.service'
import styles from './CostEstimation.module.scss'
import { ProductionTimeline } from './ProductionTimeline/ProductionTimeline'
import { GanttChart } from '../GanttChart/GanttChart'
import { axiosClassic } from '@/api/axios'

interface CostEstimationProps {
  zakazId: number
}

const CostEstimation: FC<CostEstimationProps> = ({ zakazId }) => {
  const [estimation, setEstimation] = useState<CostEstimationResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ganttData, setGanttData] = useState<any>(null)

  useEffect(() => {
    loadEstimation()
  }, [zakazId])

  useEffect(() => {
    const fetchGanttData = async () => {
      try {
        setIsLoading(true)
        const response = await axiosClassic.get(`/cost-estimation/gantt-chart/${zakazId}`)
        setGanttData(response.data)
      } catch (err) {
        setError('Ошибка при загрузке данных для диаграммы Ганта')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGanttData()
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
              <td>{material.vremyaDostavki} часов</td>
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
      
      <ProductionTimeline 
        minimalnoVremyaProizvodstva={estimation.minimalnoVremyaProizvodstva}
        vremyaFinalnyhOperatsiy={estimation.vremyaFinalnyhOperatsiy}
        vremyaOzhidaniyaIngredientov={estimation.vremyaOzhidaniyaIngredientov}
        obshcheeVremyaVypolneniya={estimation.obshcheeVremyaVypolneniya}
      />
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Общая себестоимость:</span>
          <strong>{estimation.obshchayaSebestoimost} ₽</strong>
        </div>
      </div>
      
      {isLoading && <div className={styles.loading}>Загрузка диаграммы...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {ganttData && (
        <GanttChart
          equipment={ganttData.equipment}
          startDate={new Date(ganttData.startDate)}
          endDate={new Date(ganttData.endDate)}
          zakazName={ganttData.zakazName || 'Заказ'}
          izdelieName={ganttData.izdelieName || 'Изделие'}
        />
      )}
    </div>
  )
} 

export default CostEstimation