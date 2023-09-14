import { useGameContext } from './useGameContext'

// TODO import aliases
import CardImage from '../CardImage/CardImage'
import CardPlaceholder from '../CardPlaceholder/CardPlaceholder'

import styles from './Game.module.css'

// const GAME_STATE = {
// 	USER_WON: 'USER_WON',
// 	HOUSE_WON: 'HOUSE_WON',
// 	GAME_STARTED: 'GAME_STARTED',
// 	GAME_FINISHED: 'GAME_FINISHED',
// }

const Game = () => {
	const {
		isCardDeckLoading,
		isDealerCardsLoading,
		isUserCardLoading,
		isGameFinished,
		dealerCards,
		allUserCards,
		hasUserWon,
		stand,
		startAgain,
		drawUserCard,
	} = useGameContext()

	const renderDealerCards = () => {
		return (
			<div className={styles.dealerPanel}>
				{isDealerCardsLoading || isCardDeckLoading ? (
					<>
						<CardPlaceholder />
						<CardPlaceholder />
					</>
				) : null}
				{dealerCards.map((c) => (
					<CardImage
						key={c.image}
						src={c.image}
					/>
				))}
			</div>
		)
	}

	const renderNotificationPanel = () => {
		if (!allUserCards.length) return null
		return (
			<div className={styles.notificationPanel}>
				{hasUserWon && isGameFinished ? 'you won!' : null}
				{!hasUserWon && isGameFinished ? 'house won ((' : null}
				{isGameFinished ? (
					<button
						className={styles.playAgain}
						onClick={startAgain}
					>
						play again
					</button>
				) : null}
			</div>
		)
	}

	const renderPlayerPanel = () => {
		return (
			<div className={styles.playerPanel}>
				<div className={styles.playerCards}>
					{allUserCards.map((c, index) => (
						<CardImage
							key={c.code}
							src={c.image}
							className='card-image'
							style={{
								left: index * 20,
							}}
						/>
					))}
					{isUserCardLoading || isCardDeckLoading ? <CardPlaceholder /> : null}
				</div>
				<div className={styles.playerControls}>
					<button
						className={styles.hitButton}
						disabled={isGameFinished}
						onClick={() => drawUserCard()}
					>
						hit
					</button>
					<button
						className={styles.standButton}
						disabled={isGameFinished}
						onClick={() => stand()}
					>
						stand
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.gameBoard}>
			{renderDealerCards()}
			{renderNotificationPanel()}
			{renderPlayerPanel()}
		</div>
	)
}

export default Game
