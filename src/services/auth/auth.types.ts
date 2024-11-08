export enum UserRole {
	ZAKAZCHIK = 'ZAKAZCHIK',
	MENEDZHER_PO_RABOTE_S_KLIENTAMI = 'MENEDZHER_PO_RABOTE_S_KLIENTAMI',
	MENEDZHER_PO_ZAKUPKAM = 'MENEDZHER_PO_ZAKUPKAM',
	MASTER = 'MASTER',
	DIREKTOR = 'DIREKTOR'
}

export interface ITokenInside {
	id: number
	roli: UserRole[]
	iat: number
	exp: number
}

export type TProtectUserData = Omit<ITokenInside, 'iat' | 'exp'>
