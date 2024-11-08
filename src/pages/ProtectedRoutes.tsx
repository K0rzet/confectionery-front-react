import { PUBLIC_PAGES } from '@/config/pages/public.config'
import { EnumTokens } from '@/services/auth/auth.service'
import { useCookies } from 'react-cookie'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'

export const ProtectedRoutes = () => {
	const [cookies] = useCookies([EnumTokens.ACCESS_TOKEN])
	const { user, isLoading } = useProfile()
	const location = useLocation()

	if (isLoading) return <div>Loading...</div>

	if (!cookies.accessToken) {
		return <Navigate to={PUBLIC_PAGES.LOGIN} replace />
	}

	const canAccess = (path: string) => {
		if (path.startsWith('/orders')) {
			if (path.includes('/history')) {
				return user.isDIREKTOR || user.isMENEDZHER_PO_RABOTE_S_KLIENTAMI
			}
			
			return true
		}

		switch (path) {
			case '/ingredients':
				return user.isDIREKTOR || user.isMenedzerPoZakupkam || user.isMaster || user.isZakazchik
			case '/cake-decorations':
				return user.isDIREKTOR || user.isMenedzerPoZakupkam || user.isMaster || user.isZakazchik
			case '/equipment':
				return user.isDIREKTOR
			default:
				return true
		}
	}

	if (!canAccess(location.pathname)) {
		return <Navigate to="/" replace />
	}

	return <Outlet />
}
