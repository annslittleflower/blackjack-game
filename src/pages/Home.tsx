import { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import CardPlaceholder from '../components/CardPlaceholder/CardPlaceholder'

/*
  TODO
  mobile responsive styles
  make possible to open instruction and go back to current game (useContext + useReducer???)
	better structure and CardImage component, Game component, Home only to show Game
*/

type CardValue =
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| 'JACK'
	| 'QUEEN'
	| 'KING'
	| 'ACE'

type Card = {
	code: string
	image: string
	images: {
		png: string
		svg: string
	}
	suit: string
	value: CardValue
}

const getCardValue = (faceValue: CardValue) => {
	if (faceValue === 'JACK' || faceValue === 'QUEEN' || faceValue === 'KING') {
		return 10
	}

	return +faceValue
}

const getAceValue = (currentTotalValue: number) => {
	if (currentTotalValue + 11 > 21) return 1
	return 11
}

const getTotalSum = (cards: Card[]) => {
	const cardsWithoutAces = cards.filter((c) => c.value !== 'ACE')
	const aces = cards.filter((c) => c.value === 'ACE')

	const cardsTotalValue = cardsWithoutAces.reduce(
		(acc, curVal) => acc + getCardValue(curVal.value),
		0
	)

	const acesTotalValue = aces.reduce(
		(acc) => acc + getAceValue(cardsTotalValue + acc),
		0
	)

	return cardsTotalValue + acesTotalValue
}

const canUserTakeMoreCards = (userPoints: number) => userPoints < 21

const checkIfUserWon = (userPoints: number, housePoints: number) => {
	const equal = userPoints === housePoints
	const userHasLessThan21 = userPoints < 21
	const userHasLessThanHouse = userPoints < housePoints
	const userHasMoreThanHouse = userPoints > housePoints
	const userHasBlackJack = userPoints === 21
	const houseHasBlackJack = housePoints === 21

	// looks not optimal, but easier to read and understand
	if (userHasLessThan21 && userHasLessThanHouse) return false

	// in real world game they split bank 50/50 if i remember correctly
	// in this game house wins since house has only 2 cards, so he deserves to win for being so lucky
	if (equal) return false

	if (userHasLessThan21 && userHasMoreThanHouse) return true
	if (userHasBlackJack && !houseHasBlackJack) return true
}

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

const QUERY_KEYS = {
	cardDeck: 'cardDeck',
	dealerCards: 'dealerCards',
	userCards: 'userCards',
} as const

type CardDeckData = {
	deck_id: string
	remaining: number
}

const Home = () => {
	const queryClient = useQueryClient()

	const { data: cardDeckId } = useQuery(
		[QUERY_KEYS.cardDeck],
		() => axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`),
		{
			select: (d) => d.data.deck_id,
		}
	)

	const {
		data: dealerCards,
		isFetching: isDealerCardsLoading,
		refetch: drawDealerCards,
	} = useQuery(
		[QUERY_KEYS.dealerCards],
		() =>
			axios.get<{ cards: Card[] }>(
				`${DECK_API_URL}/${cardDeckId}/draw/?count=2`
			),
		{
			enabled: false,
		}
	)

	const {
		data: userCards,
		refetch: drawUserCard,
		isFetching: isUserCardLoading,
	} = useQuery(
		[QUERY_KEYS.userCards],
		() =>
			axios.get<{ cards: Card[] }>(
				`${DECK_API_URL}/${cardDeckId}/draw/?count=1`
			),
		{
			enabled: false,
		}
	)

	// this one looks unnecessary
	const { refetch: shuffle } = useQuery(
		['shuffle'],
		() =>
			axios.get<{ cards: Card[] }>(`${DECK_API_URL}/${cardDeckId}/shuffle/`),
		{
			enabled: false,
		}
	)

	const [allUserCards, setAllUserCards] = useState<Card[]>([])
	const [hasUserWon, setHasUserWon] = useState<boolean>(false)
	const [isGameFinished, setIsGameFinished] = useState<boolean>(false)

	useEffect(() => {
		if (cardDeckId) {
			;(async () => {
				// otherwise parallel requests are made, and same cards return sometimes
				await drawDealerCards()
				await drawUserCard()
			})()
		}
	}, [cardDeckId, drawUserCard, drawDealerCards])

	useEffect(() => {
		// react-query onSuccess is deprecated
		if (userCards?.data.cards) {
			setAllUserCards((prev) => [...prev, ...userCards.data.cards])
		}
	}, [userCards])

	useEffect(() => {
		if (isDealerCardsLoading || isUserCardLoading || isGameFinished) return
		const userSum = getTotalSum(allUserCards)
		const dealerSum = getTotalSum((dealerCards?.data?.cards as Card[]) || [])
		console.table({ userSum, dealerSum })

		const hasUserBusted = userSum > 21

		if (hasUserBusted || dealerSum === 21) {
			setHasUserWon(false)
			setIsGameFinished(true)
			return
		}

		if (userSum > dealerSum) {
			setHasUserWon(true)
			setIsGameFinished(true)
			return
		}

		if (!canUserTakeMoreCards(userSum)) {
			// here linter says checkIfUserWon can return undefined
			// after 40m staring at the screen i decided to do this hack
			// but linter may be correct, linter is cool
			setHasUserWon(!!checkIfUserWon(userSum, dealerSum))
			setIsGameFinished(true)
		}
	}, [
		allUserCards,
		dealerCards,
		setHasUserWon,
		setIsGameFinished,
		isUserCardLoading,
		isDealerCardsLoading,
		isGameFinished,
	])

	const stand = () => {
		const userSum = getTotalSum(allUserCards)
		const dealerSum = getTotalSum((dealerCards?.data?.cards as Card[]) || [])

		setHasUserWon(!!checkIfUserWon(userSum, dealerSum))
		setIsGameFinished(true)
	}

	const startAgain = async () => {
		setAllUserCards([])
		await shuffle()
		queryClient.setQueriesData([QUERY_KEYS.dealerCards], {
			data: { cards: [] },
		})

		await drawDealerCards()
		await drawUserCard()

		setHasUserWon(false)
		setIsGameFinished(false)
	}

	const renderDealerCards = () => {
		return (
			<div className='dealer-panel'>
				{isDealerCardsLoading ? (
					<>
						<CardPlaceholder />
						<CardPlaceholder />
					</>
				) : null}
				{dealerCards?.data?.cards.map((c) => (
					<img
						key={c.image}
						src={c.image}
						className='card-image'
					/>
				))}
			</div>
		)
	}

	const renderNotificationPanel = () => {
		if (!allUserCards.length) return null
		return (
			<div className='notification-panel'>
				{hasUserWon && isGameFinished ? 'you won!' : null}
				{!hasUserWon && isGameFinished ? 'house won ((' : null}
				{isGameFinished ? (
					<button
						className='play-again'
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
			<div className='player-panel'>
				<div className='player-cards'>
					{[
						...allUserCards,
						// ...allUserCards,
						// ...allUserCards,
						// ...allUserCards,
					].map((c, index) => (
						<img
							key={c.code}
							src={c.image}
							className='card-image'
							style={{
								left: index * 20,
							}}
						/>
					))}

					{isUserCardLoading ? <CardPlaceholder /> : null}
				</div>
				<div className='player-controls'>
					<button
						className='hit-button'
						disabled={isGameFinished}
						onClick={() => drawUserCard()}
					>
						hit
					</button>
					<button
						className='stand-button'
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
		<div className='game-board'>
			{renderDealerCards()}
			{renderNotificationPanel()}
			{renderPlayerPanel()}
		</div>
	)
}

export default Home
