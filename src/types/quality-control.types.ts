export interface IQualityControl {
  id: number
  zakazId: number
  masterId: number
  dataProverki: Date
  parametry: IQualityParameter[]
  master: {
    id: number
    name: string
  }
}

export interface IQualityParameter {
  id: number
  nazvanie: string
  znachenie: number
  edinitsaIzmereniya: string
  rezultat: boolean
  kommentariy?: string
  kontrolId: number
}

export interface CreateParameterDto {
  nazvanie: string
  znachenie: number
  edinitsaIzmereniya: string
  rezultat: boolean
  kommentariy?: string
}

export interface UpdateParameterDto {
  rezultat: boolean
  kommentariy?: string
} 