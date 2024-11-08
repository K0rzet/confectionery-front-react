import { useState } from 'react'
import styles from './ParameterForm.module.scss'
import { CreateParameterDto } from '@/types/quality-control.types'

interface ParameterFormProps {
  onSubmit: (data: CreateParameterDto) => Promise<void>
}

export const ParameterForm = ({ onSubmit }: ParameterFormProps) => {
  const [formData, setFormData] = useState<CreateParameterDto>({
    nazvanie: '',
    znachenie: 0,
    edinitsaIzmereniya: '',
    rezultat: true,
    kommentariy: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await onSubmit(formData)
      // Очищаем форму только после успешной отправки
      setFormData({
        nazvanie: '',
        znachenie: 0,
        edinitsaIzmereniya: '',
        rezultat: true,
        kommentariy: ''
      })
    } catch (err) {
      setError('Ошибка при добавлении параметра')
      console.error('Ошибка при добавлении параметра:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Название параметра"
          value={formData.nazvanie}
          onChange={e => setFormData(prev => ({ ...prev, nazvanie: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="number"
          placeholder="Значение"
          value={formData.znachenie}
          onChange={e => setFormData(prev => ({ ...prev, znachenie: Number(e.target.value) }))}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Единица измерения"
          value={formData.edinitsaIzmereniya}
          onChange={e => setFormData(prev => ({ ...prev, edinitsaIzmereniya: e.target.value }))}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            checked={formData.rezultat}
            onChange={e => setFormData(prev => ({ ...prev, rezultat: e.target.checked }))}
            disabled={isLoading}
          />
          Соответствует качеству
        </label>
      </div>

      {!formData.rezultat && (
        <div className={styles.formGroup}>
          <textarea
            placeholder="Комментарий"
            value={formData.kommentariy}
            onChange={e => setFormData(prev => ({ ...prev, kommentariy: e.target.value }))}
            required
            disabled={isLoading}
          />
        </div>
      )}

      <button 
        type="submit" 
        disabled={isLoading}
        className={isLoading ? styles.loading : ''}
      >
        {isLoading ? 'Добавление...' : 'Добавить параметр'}
      </button>
    </form>
  )
} 