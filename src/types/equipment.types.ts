export interface IEquipment {
  id: number
  nazvanie: string
  opisanie?: string
  markirovka: string
  tipOborudovaniyaId: number
  tipOborudovaniya?: ITipOborudovaniya
  stepenIznosa: 'NOVYY' | 'SLEGKA_ISPOLZOVANNYY' | 'UMERNO_ISPOLZOVANNYY' | 'SILNO_ISPOLZOVANNYY' | 'TREBUET_ZAMENY'
  postavshchikId: number
  dataZakupki: Date
  kolichestvo: number
  kharakteristiki?: string
}
export interface ITipOborudovaniya {
  id: number
  nazvanie: string
}
export interface IEquipmentFailure {
  id: number
  oborudovanieId: number
  prichinaId: number
  vremyaNachala: Date
  vremyaOkonchaniya?: Date
  masterId: number
  kommentariy?: string
  oborudovanie: IEquipment
  prichina: IFailureReason
}

export interface IFailureReason {
  id: number
  nazvanie: string
  opisanie?: string
} 