export interface MaterialNeedDto {
  artikul: string
  nazvanie: string
  trebuemoeKolichestvo: number
  imeyushcheyesyaKolichestvo: number
  nedostayushcheeKolichestvo: number
  zakupochnayaTsena: number
  sebestoimost: number
  vremyaDostavki: number
  edinitsaIzmereniya: string
}

export interface CostEstimationResponseDto {
  ingredienty: MaterialNeedDto[]
  ukrasheniya: MaterialNeedDto[]
  obshchayaSebestoimost: number
  minimalnoVremyaDostavki: number
  minimalnoVremyaProizvodstva: number
  vremyaFinalnyhOperatsiy: number
  vremyaOzhidaniyaIngredientov: number
  obshcheeVremyaVypolneniya: number
} 