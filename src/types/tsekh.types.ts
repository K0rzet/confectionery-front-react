export enum TipMarkera {
  OBORUDOVANIE = 'OBORUDOVANIE',
  OGNETUSHITEL = 'OGNETUSHITEL',
  APTECHKA = 'APTECHKA',
  VYKHOD = 'VYKHOD'
}

export interface Marker {
  id: number;
  tip: TipMarkera;
  x: number;
  y: number;
  povorot: number;
  tsekhId: number;
}

export interface Tsekh {
  id: number;
  nazvanie: string;
  planIzobrazhenie: string;
  markery: Marker[];
  dataSozdaniya: string;
  dataObnovleniya: string;
} 