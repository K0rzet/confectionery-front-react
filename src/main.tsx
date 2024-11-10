import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './pages/router.tsx'
import Providers from './providers/Providers.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ru } from 'date-fns/locale'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Providers>
			<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
				<RouterProvider router={router} />
			</LocalizationProvider>
		</Providers>
	</React.StrictMode>
)
