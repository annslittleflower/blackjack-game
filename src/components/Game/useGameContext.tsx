import {
	useContext,
	createContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'

import {
	useQuery,
	useQueryClient,
	QueryObserverBaseResult,
} from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

import type { CardDeckData, Card } from './types'
import {
	getTotalSum,
	canUserTakeMoreCards,
	quickCheckIfUserLost,
	checkIfUserWon,
} from './helpers'

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

const QUERY_KEYS = {
	cardDeck: 'cardDeck',
	dealerCards: 'dealerCards',
	userCards: 'userCards',
}

type GameContextType = {
	isDealerCardsLoading: boolean
	isCardDeckLoading: boolean
	isUserCardLoading: boolean
	isGameFinished: boolean
	hasUserWon: boolean

	dealerCards: Card[]
	allUserCards: Card[]

	stand: () => void
	startAgain: () => Promise<void>
	drawUserCard: QueryObserverBaseResult['refetch']
}

export const GameContext = createContext<GameContextType | null>(null)

const GameContextProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient()

	const [allUserCards, setAllUserCards] = useState<Card[]>([])
	const [hasUserWon, setHasUserWon] = useState<boolean>(false)
	const [isGameFinished, setIsGameFinished] = useState<boolean>(false)

	const { data: cardDeckId, isFetching: isCardDeckLoading } = useQuery(
		[QUERY_KEYS.cardDeck],
		() => axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`),
		{
			select: (d) => d.data.deck_id,
			refetchOnMount: false,
		}
	)

	const {
		data: dealerCards = [],
		isFetching: isDealerCardsLoading,
		refetch: drawDealerCards,
	} = useQuery(
		[QUERY_KEYS.dealerCards],
		() =>
			axios.get<{ cards: Card[] }>(
				`${DECK_API_URL}/${cardDeckId}/draw/?count=2`
			),
		{
			select: (d) => d.data.cards,
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
			refetchOnMount: false,
			select: (d) => d.data.cards,
		}
	)

	const { refetch: shuffle } = useQuery(
		['shuffle'],
		() =>
			axios.get<AxiosResponse<Card[]>>(
				`${DECK_API_URL}/${cardDeckId}/shuffle/`
			),
		{
			enabled: false,
		}
	)

	useEffect(() => {
		if (cardDeckId && !userCards?.length) {
			// console.log('eff 1')
			;(async () => {
				// otherwise parallel requests are made, and same cards return sometimes
				await drawDealerCards()
				await drawUserCard()
			})()
		}
	}, [cardDeckId, drawUserCard, drawDealerCards, userCards, allUserCards])

	useEffect(() => {
		// react-query onSuccess is deprecated
		if (userCards) {
			console.log('eff 2')

			setAllUserCards((prev) => [...prev, ...userCards])
		}
	}, [userCards])

	useEffect(() => {
		if (isDealerCardsLoading || isUserCardLoading || isGameFinished) return
		const userSum = getTotalSum(allUserCards)
		const dealerSum = getTotalSum(dealerCards || [])
		console.table({ userSum, dealerSum })

		const userQuickLost = quickCheckIfUserLost(userSum, dealerSum)

		if (userQuickLost) {
			setHasUserWon(false)
			setIsGameFinished(true)
			return
		}

		if (!canUserTakeMoreCards(userSum, dealerSum)) {
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
		const dealerSum = getTotalSum(dealerCards)

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

	return (
		<GameContext.Provider
			value={{
				isDealerCardsLoading,
				isCardDeckLoading,
				isUserCardLoading,
				isGameFinished,
				hasUserWon,
				dealerCards,
				allUserCards,
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
