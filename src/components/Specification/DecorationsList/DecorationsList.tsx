import { useEffect, useState } from 'react'
import { IDecorationSpec } from '@/types/specification.types'
import specificationService from '@/services/specification.service'
import sharedStyles from '../shared.module.scss'

interface DecorationsListProps {
  decorations: IDecorationSpec[]
  onUpdate: (decorations: IDecorationSpec[]) => void
}

export const DecorationsList = ({ decorations = [], onUpdate }: DecorationsListProps) => {
  const [availableDecorations, setAvailableDecorations] = useState<Array<{id: number, nazvanie: string}>>([])

  useEffect(() => {
    loadAvailableDecorations()
  }, [])

  const loadAvailableDecorations = async () => {
    try {
      const data = await specificationService.getAvailableDecorations()
      setAvailableDecorations(data)
    } catch (error) {
      console.error('Ошибка при загрузке украшений:', error)
    }
  }

  const handleAdd = () => {
    const newDecoration: IDecorationSpec = {
      id: Date.now(),
      ukrashenieId: availableDecorations[0]?.id || 0,
      kolichestvo: 0,
      izdelieId: decorations[0]?.izdelieId || 0,
      ukrashenieTorta: {
        id: availableDecorations[0]?.id || 0,
        nazvanie: availableDecorations[0]?.nazvanie || ''
      }
    }
    onUpdate([...decorations, newDecoration])
  }

  return (
    <div className={sharedStyles.componentContainer}>
      <h3>Украшения</h3>
      <div className={sharedStyles.list}>
        {Array.isArray(decorations) && decorations.map((decoration, index) => (
          <div key={decoration.id} className={sharedStyles.item}>
            <select
              value={decoration.ukrashenieId}
              onChange={(e) => {
                const selectedDecoration = availableDecorations.find(d => d.id === Number(e.target.value))
                if (selectedDecoration) {
                  const updated = [...decorations]
                  updated[index] = {
                    ...updated[index],
                    ukrashenieId: selectedDecoration.id,
                    ukrashenieTorta: {
                      id: selectedDecoration.id,
                      nazvanie: selectedDecoration.nazvanie
                    }
                  }
                  onUpdate(updated)
                }
              }}
            >
              {availableDecorations.map(dec => (
                <option key={dec.id} value={dec.id}>
                  {dec.nazvanie}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={decoration.kolichestvo}
              onChange={(e) => {
                const updated = [...decorations]
                updated[index] = {
                  ...updated[index],
                  kolichestvo: Number(e.target.value)
                }
                onUpdate(updated)
              }}
              placeholder="Количество"
            />
            <button 
              onClick={() => onUpdate(decorations.filter((_, i) => i !== index))}
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
        Добавить украшение
      </button>
    </div>
  )
} 