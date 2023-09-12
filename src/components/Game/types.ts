export type CardValue =
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

export type Card = {
	code: string
	image: string
	images: {
		png: string
		svg: string
	}
	suit: string
	value: CardValue
}

export type CardDeckData = {
	deck_id: string
	remaining: number
}
