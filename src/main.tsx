import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import GameContextProvider from '@/components/Game/useGameContext'
import App from './App.tsx'
import Home from './pages/Home.tsx'

const Instructions = lazy(() => import('./pages/Instructions.tsx'))

const router = createBrowserRouter([
	{
		path: '/blackjack-game',
		element: <App />,
		children: [
			{
				path: '/blackjack-game',
				element: <Home />,
			},
			{
				path: '/blackjack-game/instructions',
				element: (
					<Suspense fallback={<>loading...</>}>
						<Instructions />
					</Suspense>
				),
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<GameContextProvider>
		<RouterProvider router={router} />
	</GameContextProvider>
)
