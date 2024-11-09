export interface ISpecification {
  id: number
  izdelieId: number
  nazvanie: string
  razmeryIzdeliya: IProductDimension[]
  izobrazhenia: string[]
  operatsiiSpecs: IOperation[]
  ingredientySpecs: IIngredientSpec[]
  dekorSpecs: IDecorationSpec[]
  polufabrikatySpecs: ISemifinishedSpec[]
}

export interface IOperation {
  id: number
  operatsiya: string
  poryadkovyyNomer: number
  tipOborudovaniya?: string
  vremyaOperatsii: number
  izdelieId: number
}

export interface IIngredientSpec {
  id: number
  ingredientId: number
  kolichestvo: number
  izdelieId: number
  ingredient: {
    id: number
    nazvanie: string
    edinitsaIzmereniya: string
  }
}

export interface IDecorationSpec {
  id: number
  ukrashenieId: number
  kolichestvo: number
  izdelieId: number
  ukrashenieTorta: {
    id: number
    nazvanie: string
  }
}

export interface ISemifinishedSpec {
  id: number
  polufabrikatId: number
  kolichestvo: number
  izdelieId: number
  polufabrikat: {
    id: number
    nazvanie: string
  }
}

export interface IProductDimension {
  id: number
  nazvanie: string
  znachenie: number
  edinitsaIzmereniya: string
  izdelieId: number
}

export interface IProductImage {
  id: number
  url: string
  tip: 'SKHEMA' | 'FOTO'
  izdelieId: number
}

export interface UpdateSpecificationDto {
  razmery: {
    nazvanie: string
    znachenie: number
    edinitsaIzmereniya: string
  }[]
  operatsii: {
    operatsiya: string
    poryadkovyyNomer: number
    tipOborudovaniya?: string
    vremyaOperatsii: number
  }[]
  ingredienty: {
    ingredientId: number
    kolichestvo: number
  }[]
  dekoratsii: {
    ukrashenieId: number
    kolichestvo: number
  }[]
  polufabrikaty: {
    polufabrikatId: number
    kolichestvo: number
  }[]
  izobrazhenia: {
    url: string
    tip: 'SKHEMA' | 'FOTO'
  }[]
} 