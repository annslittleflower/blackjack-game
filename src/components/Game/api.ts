import axios, { AxiosResponse } from 'axios'

import type { Card } from './types'

export type CardDeckData = {
	deck_id: string
	remaining: number
}

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

const getNewDeckRequest = () =>
	axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`)

const getDealerCardsRequest = (cardDeckId: string) =>
	axios.get<{ cards: Card[] }>(`${DECK_API_URL}/${cardDeckId}/draw/?count=2`)

const getUserCardRequest = (cardDeckId: string) =>
	axios.get<{ cards: Card[] }>(`${DECK_API_URL}/${cardDeckId}/draw/?count=1`)

const shuffleExistingDeckRequest = (cardDeckId: string) =>
	axios.get<AxiosResponse<Card[]>>(`${DECK_API_URL}/${cardDeckId}/shuffle/`)

export {
	getNewDeckRequest,
	getDealerCardsRequest,
	getUserCardRequest,
	shuffleExistingDeckRequest,
}
