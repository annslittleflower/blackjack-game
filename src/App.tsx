import { Link, Outlet } from 'react-router-dom'

const App = () => {
	return (
		<div className='container'>
			<nav className='nav'>
				<Link
					to='/blackjack-game'
					className='nav-item'
				>
					Home
				</Link>
				<Link
					to='/blackjack-game/instructions'
					className='nav-item'
				>
					Instructions
				</Link>
			</nav>
			<Outlet />
		</div>
	)
}

export default App
