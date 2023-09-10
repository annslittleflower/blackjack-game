import { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import CardPlaceholder from '../components/CardPlaceholder'

/*
  TODO

  find 10 card correct image

  beautiful styles
  some cool background, not just white
  mobile responsive styles
  API string const
  instructions text formatting and youtube videos embedding
  make possible open instruction and go back to current play (useContext???)

*/

/*
 flow:

  app loads, creates deck with API, deckId is remembered
  dealer draws 2 cards
  player draws 2 cards

  check if player wins (because dealer has only 2 cards always)

    if yes
      show message that player wins
      show button play again
      shuffle deck
      dealer draws 2 cards
      player draws 2 cards

    if no
      player hit and draws 1 card

      check if player wins

      if yes
        show message that player wins
        show button play again
        shuffle deck
        dealer draws 2 cards
        player draws 2 cards

      if no
        show message that house wins
        show button play again
        shuffle deck
        dealer draws 2 cards
        player draws 2 cards

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
	image: 'https://deckofcardsapi.com/static/img/aceDiamonds.png'
	images: {
		png: 'https://deckofcardsapi.com/static/img/aceDiamonds.png'
		svg: 'https://deckofcardsapi.com/static/img/aceDiamonds.svg'
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
		(acc) => acc + getAceValue(cardsTotalValue),
		0
	)

	const totalValue = cardsTotalValue + acesTotalValue

	return totalValue

	// console.log('cardsWithoutAces', cardsWithoutAces)
	// console.log('aces', aces)
	// console.log('cardsTotalValue', cardsTotalValue)
	// console.log('acesTotalValue', acesTotalValue)
	// console.log('totalValue', totalValue)
	// console.log('----------------------')
}

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

type CardDeckData = {
	deck_id: string
	remaining: number
}

const Home = () => {
	// query select example https://www.youtube.com/watch?v=fbIb0m_GhlU
	const { data: cardDeckResponse } = useQuery(['cardDeck'], () =>
		axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`)
	)

	const { data: dealerCards, isFetching: isDealerCardsLoading } = useQuery(
		['dealerCards'],
		() =>
			axios.get<{ cards: Card[] }>(
				`${DECK_API_URL}/${cardDeckResponse?.data.deck_id}/draw/?count=2`
			),
		{
			enabled: !!cardDeckResponse?.data.deck_id,
		}
	)

	const {
		data: userCards,
		refetch: drawUserCardOnClick,
		isFetching: isUserCardLoading,
	} = useQuery(
		['userCards'],
		() =>
			axios.get<{ cards: Card[] }>(
				`${DECK_API_URL}/${cardDeckResponse?.data.deck_id}/draw/?count=1`
			),
		{
			enabled: false,
		}
	)

	const [allUserCards, setAllUserCards] = useState<Card[]>([])

	useEffect(() => {
		// react-query onSuccess deprecated
		if (userCards?.data.cards) {
			setAllUserCards((prev) => [...prev, ...userCards.data.cards])
		}
	}, [userCards])

	useEffect(() => {
		const userSum = getTotalSum(allUserCards)
		const dealerSum = getTotalSum((dealerCards?.data?.cards as Card[]) || [])

		console.log('userSum', userSum)
		console.log('dealerSum', dealerSum)
	}, [allUserCards, dealerCards])

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
		return (
			<div className='notification-panel'>
				notifications and restart button
				<button>play again</button>
			</div>
		)
	}

	const renderPlayerPanel = () => {
		return (
			<div className='player-panel'>
				<div className='player-cards'>
					{allUserCards.map((c) => (
						<img
							key={c.code}
							src={c.image}
							className='card-image'
						/>
					))}
					{isUserCardLoading ? <CardPlaceholder /> : null}
				</div>
				<button
					className='hit-button'
					disabled={isUserCardLoading}
					onClick={() => drawUserCardOnClick()}
				>
					hit
				</button>
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
