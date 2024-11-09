import { IProductDimension } from '@/types/specification.types'
import styles from './DimensionsList.module.scss'

interface DimensionsListProps {
  dimensions: IProductDimension[]
  onUpdate: (dimensions: IProductDimension[]) => void
  izdelieId: number
}

export const DimensionsList = ({ dimensions = [], onUpdate, izdelieId }: DimensionsListProps) => {
  const handleAdd = () => {
    const newDimension: IProductDimension = {
      id: Date.now(),
      nazvanie: '',
      znachenie: 0,
      edinitsaIzmereniya: 'см',
      izdelieId
    }
    onUpdate([...dimensions, newDimension])
  }

  return (
    <div className={styles.dimensions}>
      <h3>Размеры изделия</h3>
      <div className={styles.list}>
        {Array.isArray(dimensions) && dimensions.map((dimension, index) => (
          <div key={dimension.id} className={styles.dimensionItem}>
            <input
              type="text"
              value={dimension.nazvanie}
              onChange={(e) => {
                const updated = [...dimensions]
                updated[index] = { ...updated[index], nazvanie: e.target.value }
                onUpdate(updated)
              }}
              placeholder="Название замера"
            />
            <input
              type="number"
              value={dimension.znachenie}
              onChange={(e) => {
                const updated = [...dimensions]
                updated[index] = { ...updated[index], znachenie: Number(e.target.value) }
                onUpdate(updated)
              }}
              placeholder="Значение"
            />
            <input
              type="text"
              value={dimension.edinitsaIzmereniya}
              onChange={(e) => {
                const updated = [...dimensions]
                updated[index] = { ...updated[index], edinitsaIzmereniya: e.target.value }
                onUpdate(updated)
              }}
              placeholder="Единица измерения"
            />
            <button 
              onClick={() => onUpdate(dimensions.filter((_, i) => i !== index))}
              className={styles.deleteButton}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleAdd} className={styles.addButton}>
        Добавить размер
      </button>
    </div>
  )
} 