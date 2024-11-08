import { UserRole } from '@/services/auth/auth.types'

export interface IUser {
	id: number
	name?: string
	login: string
	avatarPath?: string
	verificationToken?: string
	roli: UserRole[]
}

export interface IFormData extends Pick<IUser, 'login'> {
	parol: string
}
