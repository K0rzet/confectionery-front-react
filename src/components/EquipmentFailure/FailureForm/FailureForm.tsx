import { useState } from 'react'
import styles from './FailureForm.module.scss'

interface FailureFormProps {
  onSubmit: (data: {
    oborudovanieId: number
    prichinaId: number
    vremyaNachala: Date
    kommentariy?: string
  }) => void
  equipment: Array<{ id: number; nazvanie: string }>
  reasons: Array<{ id: number; nazvanie: string }>
}

export const FailureForm = ({ onSubmit, equipment, reasons }: FailureFormProps) => {
  const [formData, setFormData] = useState({
    oborudovanieId: '',
    prichinaId: '',
    vremyaNachala: '',
    kommentariy: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      oborudovanieId: Number(formData.oborudovanieId),
      prichinaId: Number(formData.prichinaId),
      vremyaNachala: new Date(formData.vremyaNachala)
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <select
        value={formData.oborudovanieId}
        onChange={(e) => setFormData(prev => ({ ...prev, oborudovanieId: e.target.value }))}
        required
      >
        <option value="">Выберите оборудование</option>
        {equipment.map(item => (
          <option key={item.id} value={item.id}>{item.nazvanie}</option>
        ))}
      </select>

      <select
        value={formData.prichinaId}
        onChange={(e) => setFormData(prev => ({ ...prev, prichinaId: e.target.value }))}
        required
      >
        <option value="">Выберите причину</option>
        {reasons.map(reason => (
          <option key={reason.id} value={reason.id}>{reason.nazvanie}</option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={formData.vremyaNachala}
        onChange={(e) => setFormData(prev => ({ ...prev, vremyaNachala: e.target.value }))}
        required
      />

      <textarea
        value={formData.kommentariy}
        onChange={(e) => setFormData(prev => ({ ...prev, kommentariy: e.target.value }))}
        placeholder="Комментарий"
      />

      <button type="submit">Зарегистрировать сбой</button>
    </form>
  )
} 