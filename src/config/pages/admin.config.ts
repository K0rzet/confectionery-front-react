export const ADMIN_PAGES = {
	HOME: '/admin',
	TSEKHI: '/tsekhi',
	ORDERS: '/orders',
	ORDER_HISTORY: '/orders/:id/history',
	EQUIPMENT: '/equipment',
	EQUIPMENT_FAILURES: '/equipment/failures',
	QUALITY_CONTROL: '/orders/:zakazId/quality-control',
} as const
