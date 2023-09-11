import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App.tsx'
import Home from './pages/Home.tsx'
import Instructions from './pages/Instructions.tsx'

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
				element: <Instructions />,
			},
		],
	},
])

// probably too much for this game, just wanna to exercise
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
		<ReactQueryDevtools
			initialIsOpen={import.meta.env.MODE === 'development'}
		/>
	</QueryClientProvider>
)
