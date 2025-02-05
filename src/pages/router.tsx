import { PUBLIC_PAGES } from '@/config/pages/public.config'
import { createBrowserRouter } from 'react-router-dom'

import { LoginPage } from './auth/login/Login'
import RegisterPage from './auth/register/Register'
import { HomePage } from './home/Home'
import { PlansPage } from './plans/Plans'
import { ProtectedRoutes } from './ProtectedRoutes'
import { RedirectIfAuth } from './RedirectIfAuth'
import { IngredientsPage } from './ingredients/Ingredients'
import { EquipmentPage } from './equipment/Equipment'
import { CakeDecorationsPage } from './cake-decorations/CakeDecorations'
import { TsekhiList } from './tsekhi/TsekhiList'
import { TsekhDetail } from './tsekhi/TsekhDetail'
import { ADMIN_PAGES } from '@/config/pages/admin.config'
import OrdersPage from './Orders'
import OrderHistory from './orders/OrderHistory'
import { EquipmentFailures } from './EquipmentFailures/EquipmentFailures'
import { QualityControlPage } from './QualityControl/QualityControl'
import { SpecificationPage } from './Specification/Specification'
import { InventoryReportPage } from './inventory-report/InventoryReportPage'
import { PurchaseReportPage } from './purchase-report/PurchaseReportPage'
import { EquipmentFailuresReportPage } from './equipment-failures/EquipmentFailuresReportPage'


export const router = createBrowserRouter([
	{
		element: <RedirectIfAuth />,
		children: [
			{
				path: PUBLIC_PAGES.LOGIN,
				element: <LoginPage />
			},
			{
				path: PUBLIC_PAGES.REGISTER,
				element: <RegisterPage />
			}
		]
	},
	{
		element: <ProtectedRoutes />,
		children: [
			{
				path: '/',
				element: <HomePage />
			},
			{
				path: ADMIN_PAGES.TSEKHI,
				element: <TsekhiList />
			},
			{
				path: `${ADMIN_PAGES.TSEKHI}/:id`,
				element: <TsekhDetail />
			},
			{
				path: '/ingredients',
				element: <IngredientsPage />
			},
			{
				path: '/equipment',
				element: <EquipmentPage />
			},
			{
				path: '/cake-decorations',
				element: <CakeDecorationsPage />
			},
			{
				path: ADMIN_PAGES.ORDERS,
				element: <OrdersPage />
			},
			{
				path: `${ADMIN_PAGES.ORDERS}/:id/history`,
				element: <OrderHistory />
			},
			{
				path: ADMIN_PAGES.EQUIPMENT,
				element: <EquipmentPage />
			},
			{
				path: ADMIN_PAGES.EQUIPMENT_FAILURES,
				element: <EquipmentFailures />
			},
			{
				path: `${ADMIN_PAGES.QUALITY_CONTROL}`,
				element: <QualityControlPage />
			},
			{
				path: ADMIN_PAGES.SPECIFICATION_DETAIL,
				element: <SpecificationPage />
			},
			{
				path: ADMIN_PAGES.INVENTORY_REPORT,
				element: <InventoryReportPage />
			},
			{
				path: ADMIN_PAGES.PURCHASE_REPORT,
				element: <PurchaseReportPage />
			},
			{
				path: ADMIN_PAGES.EQUIPMENT_FAILURES_REPORT,
				element: <EquipmentFailuresReportPage />
			}
		]
	},
	{
		path: PUBLIC_PAGES.PLANS,
		element: <PlansPage />
	},
	{
		path: '*',
		element: <div>404 not found!</div>
	}
])
