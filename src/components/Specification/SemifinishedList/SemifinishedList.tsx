import { useEffect, useState } from 'react'
import { ISemifinishedSpec } from '@/types/specification.types'
import specificationService from '@/services/specification.service'
import sharedStyles from '../shared.module.scss'

interface SemifinishedListProps {
  semifinished: ISemifinishedSpec[]
  onUpdate: (semifinished: ISemifinishedSpec[]) => void
}

export const SemifinishedList = ({ semifinished = [], onUpdate }: SemifinishedListProps) => {
  const [availableSemifinished, setAvailableSemifinished] = useState<Array<{id: number, nazvanie: string}>>([])

  useEffect(() => {
    loadAvailableSemifinished()
  }, [])

  const loadAvailableSemifinished = async () => {
    try {
      const data = await specificationService.getAvailableSemifinished()
      setAvailableSemifinished(data)
    } catch (error) {
      console.error('Ошибка при загрузке полуфабрикатов:', error)
    }
  }

  const handleAdd = () => {
    const newSemifinished: ISemifinishedSpec = {
      id: Date.now(),
      polufabrikatId: availableSemifinished[0]?.id || 0,
      kolichestvo: 0,
      izdelieId: semifinished[0]?.izdelieId || 0,
      polufabrikat: {
        id: availableSemifinished[0]?.id || 0,
        nazvanie: availableSemifinished[0]?.nazvanie || ''
      }
    }
    onUpdate([...semifinished, newSemifinished])
  }

  return (
    <div className={sharedStyles.componentContainer}>
      <h3>Полуфабрикаты</h3>
      <div className={sharedStyles.list}>
        {Array.isArray(semifinished) && semifinished.map((item, index) => (
          <div key={item.id} className={sharedStyles.item}>
            <select
              value={item.polufabrikatId}
              onChange={(e) => {
                const selectedItem = availableSemifinished.find(s => s.id === Number(e.target.value))
                if (selectedItem) {
                  const updated = [...semifinished]
                  updated[index] = {
                    ...updated[index],
                    polufabrikatId: selectedItem.id,
                    polufabrikat: {
                      id: selectedItem.id,
                      nazvanie: selectedItem.nazvanie
                    }
                  }
                  onUpdate(updated)
                }
              }}
            >
              {availableSemifinished.map(semi => (
                <option key={semi.id} value={semi.id}>
                  {semi.nazvanie}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.kolichestvo}
              onChange={(e) => {
                const updated = [...semifinished]
                updated[index] = {
                  ...updated[index],
                  kolichestvo: Number(e.target.value)
                }
                onUpdate(updated)
              }}
              placeholder="Количество"
            />
            <button 
              onClick={() => onUpdate(semifinished.filter((_, i) => i !== index))}
              className={sharedStyles.deleteButton}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <button 
        onClick={handleAdd}
        className={sharedStyles.addButton}
      >
        Добавить полуфабрикат
      </button>
    </div>
  )
} 