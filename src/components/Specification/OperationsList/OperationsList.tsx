import { IOperation } from '@/types/specification.types'
import styles from './OperationsList.module.scss'

interface OperationsListProps {
  operations: IOperation[]
  onUpdate: (operations: IOperation[]) => void
}

export const OperationsList = ({ operations, onUpdate }: OperationsListProps) => {
  const handleAdd = () => {
    const newOperation: IOperation = {
      id: Date.now(), // временный ID
      operatsiya: '',
      poryadkovyyNomer: operations.length + 1,
      vremyaOperatsii: 0,
      izdelieId: operations[0]?.izdelieId || 0
    }
    onUpdate([...operations, newOperation])
  }

  const handleUpdate = (index: number, field: keyof IOperation, value: any) => {
    const updatedOperations = [...operations]
    updatedOperations[index] = { ...updatedOperations[index], [field]: value }
    onUpdate(updatedOperations)
  }

  const handleDelete = (index: number) => {
    const updatedOperations = operations.filter((_, i) => i !== index)
    onUpdate(updatedOperations)
  }

  return (
    <div className={styles.operations}>
      <h3>Операции</h3>
      {operations.map((operation, index) => (
        <div key={operation.id} className={styles.operationItem}>
          <input
            type="number"
            value={operation.poryadkovyyNomer}
            onChange={(e) => handleUpdate(index, 'poryadkovyyNomer', parseInt(e.target.value))}
            placeholder="№"
          />
          <input
            type="text"
            value={operation.operatsiya}
            onChange={(e) => handleUpdate(index, 'operatsiya', e.target.value)}
            placeholder="Описание операции"
          />
          <input
            type="text"
            value={operation.tipOborudovaniya || ''}
            onChange={(e) => handleUpdate(index, 'tipOborudovaniya', e.target.value)}
            placeholder="Тип оборудования"
          />
          <input
            type="number"
            value={operation.vremyaOperatsii}
            onChange={(e) => handleUpdate(index, 'vremyaOperatsii', parseInt(e.target.value))}
            placeholder="Время (мин)"
          />
          <button onClick={() => handleDelete(index)}>Удалить</button>
        </div>
      ))}
      <button onClick={handleAdd} className={styles.addButton}>
        Добавить операцию
      </button>
    </div>
  )
} 