// import { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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

	console.log('deckId', cardDeckResponse?.data.deck_id)
	console.log('remainingCards', cardDeckResponse?.data.remaining)

	return <main>Home page awddwa</main>
}

export default Home
