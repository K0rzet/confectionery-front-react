import { useEffect, useState } from 'react'
import { FailureForm } from '@/components/EquipmentFailure/FailureForm/FailureForm'
import equipmentService from '@/services/equipments/equipment.service'
import { IEquipment, IEquipmentFailure, IFailureReason } from '@/types/equipment.types'
import styles from './EquipmentFailures.module.scss'
import { useProfile } from '@/hooks/useProfile'

export const EquipmentFailures = () => {
  const [failures, setFailures] = useState<IEquipmentFailure[]>([])
  const [equipment, setEquipment] = useState<IEquipment[]>([])
  const [reasons, setReasons] = useState<IFailureReason[]>([])
  const { user } = useProfile()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [failuresData, reasonsData, equipmentData] = await Promise.all([
        equipmentService.getFailures(),
        equipmentService.getFailureReasons(),
        equipmentService.getEquipment({})
      ])
      setFailures(failuresData)
      setReasons(reasonsData)
      setEquipment(equipmentData)
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    }
  }

  const handleCreateFailure = async (data: {
    oborudovanieId: number
    prichinaId: number
    vremyaNachala: Date
    kommentariy?: string
  }) => {
    try {
      if (!user) return
      if (!user.id) return
      await equipmentService.createFailure({
        ...data,
        masterId: user.id
      })
      await loadData()
    } catch (error) {
      console.error('Ошибка при создании сбоя:', error)
    }
  }

  const handleCompleteFailure = async (id: number) => {
    try {
      await equipmentService.completeFailure(id, new Date())
      await loadData()
    } catch (error) {
      console.error('Ошибка при завершении сбоя:', error)
    }
  }

  return (
    <div className={styles.container}>
      <h1>Управление сбоями оборудования</h1>
      
      <FailureForm
        onSubmit={handleCreateFailure}
        equipment={equipment}
        reasons={reasons}
      />

      <div className={styles.failuresList}>
        {failures.map(failure => (
          <div key={failure.id} className={styles.failureItem}>
            <h3>{failure.oborudovanie.nazvanie}</h3>
            <p>Причина: {failure.prichina.nazvanie}</p>
            <p>Начало: {new Date(failure.vremyaNachala).toLocaleString()}</p>
            {failure.vremyaOkonchaniya ? (
              <p>Окончание: {new Date(failure.vremyaOkonchaniya).toLocaleString()}</p>
            ) : (
              <button 
                onClick={() => handleCompleteFailure(failure.id)}
                className={styles.completeButton}
              >
                Завершить
              </button>
            )}
            {failure.kommentariy && (
              <p className={styles.comment}>
                Комментарий: {failure.kommentariy}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 