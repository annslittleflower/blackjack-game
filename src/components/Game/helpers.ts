import type { Card, CardValue } from './types'

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

export const getTotalSum = (cards: Card[]) => {
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

export const canUserTakeMoreCards = (
  userPoints: number,
  housePoints: number
) => {
  if (userPoints > housePoints) return false

  if (userPoints < housePoints || userPoints < 21) return true
}

export const quickCheckIfUserLost = (
  userPoints: number,
  housePoints: number
) => {
  const hasUserBusted = userPoints > 21

  const houseHasBlackJack = housePoints === 21

  if (hasUserBusted || houseHasBlackJack) return true
}

export const checkIfUserWon = (userPoints: number, housePoints: number) => {
  const equal = userPoints === housePoints
  const userHasLessThan21 = userPoints < 21
  const userHasLessThanHouse = userPoints < housePoints
  const userHasMoreThanHouse = userPoints > housePoints
  const userHasBlackJack = userPoints === 21
  const houseHasBlackJack = housePoints === 21
  const hasUserBusted = userPoints > 21

  // something is wrong with 2 functions doing almost the same job, but cannot figure out nice solution for now
  // looks not optimal, but easier to read and understand
  if (hasUserBusted) return false
  if (userHasLessThan21 && userHasLessThanHouse) return false

  // in real world game they split bank 50/50 if i remember correctly
  // in this game house wins since house has only 2 cards, so he deserves to win for being so lucky
  if (equal) return false
  if (userHasLessThan21 && userHasMoreThanHouse) return true
  if (userHasBlackJack && !houseHasBlackJack) return true
}
