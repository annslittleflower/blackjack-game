const Instructions = () => {
	return (
		<div>
			<p>The House is initially dealt 2 face up cards and no more</p>
			<p>
				You (Player) are also initially dealt two face up cards, but you have
				one of the following options: Hit: You are dealt one more card to add to
				your point value. For this project, the player may hit as many times as
				they like, until their card value exceeds 21, at which point the game
				ends in an automatic loss Stand: Ends the round (for the purposes of
				this project, this will end the game)
			</p>
			<p>
				Once you end the round, the game is over, and there should be a display
				of whether you won or lost.
			</p>
			<p>Playing with one deck and shuffle after each round</p>
			<p>
				you win if your current total is &lt; 21 but higher than the House’s
				total or your current total is 21 and the House’s total is not 21
			</p>
			<p>
				You lose if your current total totals over 21 or your current total is
				&lt; 21 but lower than the House’s total
				<br />
				You tie with the House
			</p>
			<br />
			<br />
			<a
				href='https://www.youtube.com/watch?v=PljDuynF-j0'
				target='_blank'
				rel='noreferrer'
			>
				how to play
			</a>
			<br />
			https://www.youtube.com/watch?v=ZApzTKZV0Ro
			<br />
			https://www.youtube.com/watch?v=xjqTIzYkGdI
			<br />
			https://www.youtube.com/watch?v=GWBcCkJFXl8
		</div>
	)
}

export default Instructions
