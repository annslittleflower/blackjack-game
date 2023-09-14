import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

// TODO import aliases
import CardImage from '../CardImage/CardImage'
import CardPlaceholder from '../CardPlaceholder/CardPlaceholder'

import type { CardDeckData, Card } from './types'
import {
	getTotalSum,
	canUserTakeMoreCards,
	quickCheckIfUserLost,
	checkIfUserWon,
} from './helpers'

import styles from './Game.module.css'

const DECK_API_URL = 'https://deckofcardsapi.com/api/deck'

const QUERY_KEYS = {
	cardDeck: 'cardDeck',
	dealerCards: 'dealerCards',
	userCards: 'userCards',
}

const Game = () => {
	const queryClient = useQueryClient()

	const { data: cardDeckId, isFetching: isCardDeckLoading } = useQuery(
		[QUERY_KEYS.cardDeck],
		() => axios.get<CardDeckData>(`${DECK_API_URL}/new/shuffle/?deck_count=1`),
		{
			select: (d) => d.data.deck_id,
			refetchOnMount: false,
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
			refetchOnMount: false,
			select: (d) => d.data.cards,
		}
	)

	// this one looks unnecessary
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

	const [allUserCards, setAllUserCards] = useState<Card[]>([])
	const [hasUserWon, setHasUserWon] = useState<boolean>(false)
	const [isGameFinished, setIsGameFinished] = useState<boolean>(false)

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
		const dealerSum = getTotalSum((dealerCards?.data?.cards as Card[]) || [])
		console.table({ userSum, dealerSum })

		const userQuickLost = quickCheckIfUserLost(userSum, dealerSum)

		if (userQuickLost) {
			setHasUserWon(false)
			setIsGameFinished(true)
			return
		}

		console.log('can', canUserTakeMoreCards(userSum, dealerSum))
		if (!canUserTakeMoreCards(userSum, dealerSum)) {
			// here linter says checkIfUserWon can return undefined
			// after 40m staring at the screen i decided to do this hack
			// but linter may be correct, linter is cool
			console.log('check:', checkIfUserWon(userSum, dealerSum))
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
			<div className={styles.dealerPanel}>
				{isDealerCardsLoading || isCardDeckLoading ? (
					<>
						<CardPlaceholder />
						<CardPlaceholder />
					</>
				) : null}
				{dealerCards?.data?.cards.map((c) => (
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
