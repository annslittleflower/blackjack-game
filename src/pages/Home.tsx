// import { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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

type CardDeckData = {
	deck_id: string
	remaining: number
}

const Home = () => {
	const { data: cardDeckResponse } = useQuery(['cardDeck'], () =>
		axios.get<CardDeckData>(
			'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
		)
	)

	const { data: dealerCards } = useQuery(
		['dealerCards'],
		() =>
			axios.get<{ cards: Record<string, unknown>[] }>(
				`https://deckofcardsapi.com/api/deck/${cardDeckResponse?.data.deck_id}/draw/?count=2`
			),
		{
			enabled: !!cardDeckResponse?.data.deck_id,
		}
	)

	const { data: userCards, refetch: drawUserCardOnClick } = useQuery(
		['userCards'],
		() =>
			axios.get<{ cards: Record<string, unknown>[] }>(
				`https://deckofcardsapi.com/api/deck/${cardDeckResponse?.data.deck_id}/draw/?count=1`
			),
		{
			enabled: false,
		}
	)

	console.log('dealerCards', dealerCards)
	console.log('userCards', userCards)
	console.log('deckId', cardDeckResponse?.data.deck_id)
	console.log('remainingCards', cardDeckResponse?.data.remaining)

	const renderDealerCards = () => {
		if (!dealerCards?.data.cards) return null
		return (
			<div className='dealer-panel'>
				{dealerCards.data?.cards.map((c) => (
					<img
						key={c.code as string}
						src={c.image as string}
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

	const renderPlayer = () => {
		return (
			<div className='player-panel'>
				{userCards?.data?.cards?.map((c) => (
					<img
						key={c.code as string}
						src={c.image as string}
						className='card-image'
					/>
				))}
				<button
					className='hit-button'
					onClick={() => drawUserCardOnClick()}
				>
					hit
				</button>
			</div>
		)
	}

	return (
		<main>
			<div className='game-board'>
				{renderDealerCards()}
				{renderNotificationPanel()}
				{renderPlayer()}
			</div>
		</main>
	)
}

export default Home
