import { Link, Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <nav>
        <Link to="/blackjack-game">Home</Link>
        {" | "}
        <Link to="/blackjack-game/instructions">Instructions</Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
