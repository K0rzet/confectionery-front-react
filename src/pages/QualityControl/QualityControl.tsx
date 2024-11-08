import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ParameterForm } from '@/components/QualityControl/ParameterForm/ParameterForm'
import { ParameterList } from '@/components/QualityControl/ParameterList/ParameterList'
import qualityControlService from '@/services/quality-control.service'
import { CreateParameterDto, IQualityControl } from '@/types/quality-control.types'
import styles from './QualityControl.module.scss'

export const QualityControlPage = () => {
  const { zakazId } = useParams<{ zakazId: string }>()
  const [qualityControl, setQualityControl] = useState<IQualityControl | null>(null)

  useEffect(() => {
    loadQualityControl()
  }, [zakazId])

  const loadQualityControl = async () => {
    if (!zakazId) return
    try {
      const data = await qualityControlService.getQualityControl(Number(zakazId))
      setQualityControl(data)
    } catch (error) {
      console.error('Ошибка при загрузке контроля качества:', error)
    }
  }

  const handleAddParameter = async (data: CreateParameterDto) => {
    if (!qualityControl) {
      try {
        const newControl = await qualityControlService.createQualityControl(Number(zakazId))
        setQualityControl(newControl)
        
        await qualityControlService.addParameter(newControl.id, data)
      } catch (error) {
        console.error('Ошибка при создании контроля качества:', error)
        throw error
      }
    } else {
      try {
        await qualityControlService.addParameter(qualityControl.id, data)
      } catch (error) {
        console.error('Ошибка при добавлении параметра:', error)
        throw error
      }
    }
    
    await loadQualityControl()
  }

  return (
    <div className={styles.container}>
      <h1>Контроль качества</h1>

      <ParameterList
        parameters={qualityControl?.parametry || []}
        onUpdateParameter={async (parameterId, rezultat, kommentariy) => {
          try {
            await qualityControlService.updateParameter(parameterId, { rezultat, kommentariy })
            loadQualityControl()
          } catch (error) {
            console.error('Ошибка при обновлении параметра:', error)
          }
        }}
      />

      <ParameterForm onSubmit={handleAddParameter} />
    </div>
  )
} 