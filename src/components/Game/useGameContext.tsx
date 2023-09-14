import {
	useContext,
	createContext,
	useEffect,
	useReducer,
	ReactNode,
} from 'react'

import {
	getNewDeckRequest,
	getDealerCardsRequest,
	getUserCardRequest,
	shuffleExistingDeckRequest,
} from './api'
import type { Card } from './types'
import {
	getTotalSum,
	canUserTakeMoreCards,
	quickCheckIfUserLost,
	checkIfUserWon,
} from './helpers'

type GameStateType = {
	isDealerCardsLoading: boolean
	isCardDeckLoading: boolean
	isUserCardLoading: boolean
	isGameFinished: boolean
	hasUserWon: boolean

	cardDeckId: string
	dealerCards: Card[]
	userCards: Card[]
}

type GameContextType = {
	stand: () => void
	startAgain: () => void
	drawUserCard: () => void
} & GameStateType

export const GameContext = createContext<GameContextType | null>(null)

const ACTION_TYPES = {
	CARD_DECK_LOADED: 'CARD_DECK_LOADED',
	DEALER_CARDS_LOADED: 'DEALER_CARDS_LOADED',
	USER_CARD_LOADED: 'USER_CARD_LOADED',

	PLAY_AGAIN: 'PLAY_AGAIN',
	STAND: 'STAND',
} as const

type GameActionType = {
	type: keyof typeof ACTION_TYPES
	payload?: string | Card | Card[]
}

const initialState: GameStateType = {
	isCardDeckLoading: true,
	isDealerCardsLoading: true,
	isUserCardLoading: true,
	isGameFinished: false,
	hasUserWon: false,
	cardDeckId: '',
	dealerCards: [],
	userCards: [],
}

const reducer = (
	state: GameStateType,
	action: GameActionType
): GameStateType => {
	const { type, payload } = action

	switch (type) {
		case ACTION_TYPES.CARD_DECK_LOADED:
			return {
				...state,
				isCardDeckLoading: false,
				cardDeckId: payload as string,
			}
		case ACTION_TYPES.DEALER_CARDS_LOADED:
			return {
				...state,
				isDealerCardsLoading: false,
				dealerCards: payload as Card[],
			}
		case ACTION_TYPES.USER_CARD_LOADED: {
			const newCards = [...state.userCards, ...(payload as Card[])]
			const userSum = getTotalSum(newCards)
			const dealerSum = getTotalSum(state.dealerCards)
			console.table({ userSum, dealerSum })

			const userQuickLost = quickCheckIfUserLost(userSum, dealerSum)

			if (userQuickLost) {
				return {
					...state,
					userCards: newCards,
					hasUserWon: false,
					isGameFinished: true,
				}
			}

			if (!canUserTakeMoreCards(userSum, dealerSum)) {
				return {
					...state,
					userCards: newCards,
					// here linter says checkIfUserWon can return undefined
					// after 40m staring at the screen i decided to do this hack
					// but linter may be correct, linter is cool
					hasUserWon: !!checkIfUserWon(userSum, dealerSum),
					isGameFinished: true,
				}
			}
			return {
				...state,
				isUserCardLoading: false,
				userCards: newCards,
			}
		}
		case ACTION_TYPES.STAND: {
			const userSum = getTotalSum(state.userCards)
			const dealerSum = getTotalSum(state.dealerCards)
			return {
				...state,
				hasUserWon: !!checkIfUserWon(userSum, dealerSum),
				isGameFinished: true,
			}
		}
		case ACTION_TYPES.PLAY_AGAIN:
			return {
				...state,
				hasUserWon: false,
				isGameFinished: false,
				userCards: [],
				dealerCards: [],
			}
		default:
			return state
	}
}

const GameContextProvider = ({ children }: { children: ReactNode }) => {
	const [
		{
			cardDeckId,
			userCards,
			dealerCards,
			hasUserWon,
			isGameFinished,
			isCardDeckLoading,
			isDealerCardsLoading,
			isUserCardLoading,
		},
		dispatch,
	] = useReducer(reducer, initialState)

	useEffect(() => {
		;(async () => {
			const newDeckResponse = await getNewDeckRequest()

			const newDeckId = newDeckResponse.data.deck_id

			dispatch({
				type: ACTION_TYPES.CARD_DECK_LOADED,
				payload: newDeckId,
			})

			const dealerCardsResponse = await getDealerCardsRequest(newDeckId)

			dispatch({
				type: ACTION_TYPES.DEALER_CARDS_LOADED,
				payload: dealerCardsResponse.data.cards,
			})

			const userCardResponse = await getUserCardRequest(newDeckId)

			dispatch({
				type: ACTION_TYPES.USER_CARD_LOADED,
				payload: userCardResponse.data.cards,
			})
		})()
	}, [])

	const drawUserCard = async () => {
		const userCardResponse = await getUserCardRequest(cardDeckId as string)

		dispatch({
			type: ACTION_TYPES.USER_CARD_LOADED,
			payload: userCardResponse.data.cards,
		})
	}

	const stand = async () => {
		dispatch({
			type: ACTION_TYPES.STAND,
		})
	}

	const startAgain = async () => {
		dispatch({
			type: ACTION_TYPES.PLAY_AGAIN,
		})

		await shuffleExistingDeckRequest(cardDeckId)

		const dealerCardsResponse = await getDealerCardsRequest(cardDeckId)

		dispatch({
			type: ACTION_TYPES.DEALER_CARDS_LOADED,
			payload: dealerCardsResponse.data.cards,
		})

		const userCardResponse = await getUserCardRequest(cardDeckId)

		dispatch({
			type: ACTION_TYPES.USER_CARD_LOADED,
			payload: userCardResponse.data.cards,
		})
	}

	return (
		<GameContext.Provider
			value={{
				isDealerCardsLoading,
				isCardDeckLoading,
				isUserCardLoading,
				isGameFinished,
				hasUserWon,
				dealerCards,
				userCards,
				cardDeckId,
				stand,
				startAgain,
				drawUserCard,
			}}
		>
			{children}
		</GameContext.Provider>
	)
}

export const useGameContext = () => {
	const context = useContext(GameContext)

	if (!context) {
		throw new Error('Context must be inside a provider')
	}

	return context
}

export default GameContextProvider
