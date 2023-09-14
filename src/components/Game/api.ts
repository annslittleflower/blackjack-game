import axios, { AxiosResponse } from 'axios'

import type { CardDeckData, Card } from './types'

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

const getNewDeck = () =>
	axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`)

const getDealerCards = (cardDeckId: string) =>
	axios.get<{ cards: Card[] }>(`${DECK_API_URL}/${cardDeckId}/draw/?count=2`)

const getUserCard = (cardDeckId: string) =>
	axios.get<{ cards: Card[] }>(`${DECK_API_URL}/${cardDeckId}/draw/?count=1`)

const shuffleExistingDeck = (cardDeckId: string) =>
	axios.get<AxiosResponse<Card[]>>(`${DECK_API_URL}/${cardDeckId}/shuffle/`)

export { getNewDeck, getDealerCards, getUserCard, shuffleExistingDeck }
