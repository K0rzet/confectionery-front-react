import { FC } from 'react'
import styles from './ProductionTimeline.module.scss'

interface ProductionTimelineProps {
  minimalnoVremyaProizvodstva: number
  vremyaFinalnyhOperatsiy: number
  vremyaOzhidaniyaIngredientov: number
  obshcheeVremyaVypolneniya: number
}

export const ProductionTimeline: FC<ProductionTimelineProps> = ({
  minimalnoVremyaProizvodstva,
  vremyaFinalnyhOperatsiy,
  vremyaOzhidaniyaIngredientov,
  obshcheeVremyaVypolneniya,
}) => {
  return (
    <div className={styles.timeline}>
      <h3>Оценка минимального времени производства</h3>
      
      <div className={styles.timeInfo}>
        <div className={styles.timeItem}>
          <span>Минимальное время основного производства:</span>
          <strong>{minimalnoVremyaProizvodstva} ч</strong>
        </div>
        
        <div className={styles.timeItem}>
          <span>Время финальных операций (пропитка и т.д.):</span>
          <strong>{vremyaFinalnyhOperatsiy} ч</strong>
        </div>
        
        <div className={styles.timeItem}>
          <span>Время ожидания ингредиентов и украшений:</span>
          <strong>{vremyaOzhidaniyaIngredientov} ч</strong>
        </div>
        
        <div className={styles.timeTotal}>
          <span>Общее время выполнения заказа:</span>
          <strong>{obshcheeVremyaVypolneniya} ч</strong>
          <div className={styles.explanation}>
            (максимум из суммы времени производства с финальными операциями 
            и времени ожидания ингредиентов)
          </div>
        </div>
      </div>
    </div>
  )
} 