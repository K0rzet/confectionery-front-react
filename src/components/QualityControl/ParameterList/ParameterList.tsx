import { IQualityParameter } from '@/types/quality-control.types'
import styles from './ParameterList.module.scss'

interface ParameterListProps {
  parameters: IQualityParameter[]
  onUpdateParameter: (parameterId: number, rezultat: boolean, kommentariy?: string) => Promise<void>
}

export const ParameterList = ({ parameters, onUpdateParameter }: ParameterListProps) => {
  return (
    <div className={styles.list}>
      {parameters.map(parameter => (
        <div key={parameter.id} className={styles.parameter}>
          <div className={styles.header}>
            <h3>{parameter.nazvanie}</h3>
            <span className={styles.value}>
              {parameter.znachenie} {parameter.edinitsaIzmereniya}
            </span>
          </div>
          
          <div className={styles.controls}>
            <label>
              <input
                type="checkbox"
                checked={parameter.rezultat}
                onChange={e => onUpdateParameter(parameter.id, e.target.checked)}
              />
              Соответствует качеству
            </label>
          </div>

          {!parameter.rezultat && (
            <textarea
              className={styles.comment}
              value={parameter.kommentariy || ''}
              onChange={e => onUpdateParameter(parameter.id, false, e.target.value)}
              placeholder="Комментарий к несоответствию"
            />
          )}
        </div>
      ))}
    </div>
  )
} 