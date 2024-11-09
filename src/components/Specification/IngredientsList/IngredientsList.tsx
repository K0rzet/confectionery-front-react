import { useEffect, useState } from 'react'
import { IIngredientSpec } from '@/types/specification.types'
import specificationService from '@/services/specification.service'
import sharedStyles from '../shared.module.scss'

interface IngredientsListProps {
  ingredients: IIngredientSpec[]
  onUpdate: (ingredients: IIngredientSpec[]) => void
}

export const IngredientsList = ({ ingredients = [], onUpdate }: IngredientsListProps) => {
  const [availableIngredients, setAvailableIngredients] = useState<Array<{id: number, nazvanie: string, edinitsaIzmereniya: string}>>([])

  useEffect(() => {
    loadAvailableIngredients()
  }, [])

  const loadAvailableIngredients = async () => {
    try {
      const data = await specificationService.getAvailableIngredients()
      setAvailableIngredients(data)
    } catch (error) {
      console.error('Ошибка при загрузке ингредиентов:', error)
    }
  }

  const handleAdd = () => {
    if (availableIngredients.length === 0) return

    const firstIngredient = availableIngredients[0]
    const newIngredient: IIngredientSpec = {
      id: Date.now(),
      ingredientId: firstIngredient.id,
      kolichestvo: 0,
      izdelieId: ingredients[0]?.izdelieId || 0,
      ingredient: {
        id: firstIngredient.id,
        nazvanie: firstIngredient.nazvanie,
        edinitsaIzmereniya: firstIngredient.edinitsaIzmereniya
      }
    }
    onUpdate([...ingredients, newIngredient])
  }

  return (
    <div className={sharedStyles.componentContainer}>
      <h3>Ингредиенты</h3>
      <div className={sharedStyles.list}>
        {Array.isArray(ingredients) && ingredients.map((ingredient, index) => (
          <div key={ingredient.id} className={sharedStyles.item}>
            <select
              value={ingredient.ingredientId}
              onChange={(e) => {
                const selectedIngredient = availableIngredients.find(i => i.id === Number(e.target.value))
                if (selectedIngredient) {
                  const updated = [...ingredients]
                  updated[index] = {
                    ...updated[index],
                    ingredientId: selectedIngredient.id,
                    ingredient: {
                      id: selectedIngredient.id,
                      nazvanie: selectedIngredient.nazvanie,
                      edinitsaIzmereniya: selectedIngredient.edinitsaIzmereniya
                    }
                  }
                  onUpdate(updated)
                }
              }}
            >
              {availableIngredients.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.nazvanie}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={ingredient.kolichestvo}
              onChange={(e) => {
                const updated = [...ingredients]
                updated[index] = {
                  ...updated[index],
                  kolichestvo: Number(e.target.value)
                }
                onUpdate(updated)
              }}
              placeholder="Количество"
            />
            <span>{ingredient.ingredient?.edinitsaIzmereniya}</span>
            <button 
              onClick={() => onUpdate(ingredients.filter((_, i) => i !== index))}
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
        disabled={availableIngredients.length === 0}
      >
        Добавить ингредиент
      </button>
    </div>
  )
} 