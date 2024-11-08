import { type TProtectUserData, UserRole } from '@/services/auth/auth.types'

export type TUserDataState = {
	id: number
	roli: UserRole[]
	isLoggedIn: boolean
	isMENEDZHER_PO_RABOTE_S_KLIENTAMI: boolean
	isDIREKTOR: boolean
	isMenedzerPoZakupkam: boolean
	isMaster: boolean
	isZakazchik: boolean
}

export const transformUserToState = (
	user: TProtectUserData
): TUserDataState | null => {
	return {
		...user,
		isLoggedIn: true,
		isMENEDZHER_PO_RABOTE_S_KLIENTAMI: user.roli.includes(
			UserRole.MENEDZHER_PO_RABOTE_S_KLIENTAMI
		),
		isDIREKTOR: user.roli.includes(UserRole.DIREKTOR),
		isMenedzerPoZakupkam: user.roli.includes(UserRole.MENEDZHER_PO_ZAKUPKAM),
		isMaster: user.roli.includes(UserRole.MASTER),
		isZakazchik: user.roli.includes(UserRole.ZAKAZCHIK)
	}
}
