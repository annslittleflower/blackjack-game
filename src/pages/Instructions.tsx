const Instructions = () => {
	return (
		<div className='instructions'>
			<p>The House is initially dealt 2 face up cards and no more</p>
			<p>
				You (Player) are also initially dealt two face up cards, but you have
				one of the following options:
				<ul>
					<li>
						Hit: You are dealt one more card to add to your point value. For
						this project, the player may hit as many times as they like, until
						their card value exceeds 21, at which point the game ends in an
						automatic loss
					</li>
					<li>
						Stand: Ends the round (for the purposes of this project, this will
						end the game)
					</li>
				</ul>
			</p>
			<p>
				Once you end the round, the game is over, and there should be a display
				of whether you won or lost.
			</p>
			<p>Playing with one deck and shuffle after each round</p>
			<p>
				You win if:
				<ul>
					<li>
						your current total is &lt; 21 but higher than the House’s total
					</li>
					<li>your current total is 21 and the House’s total is not 21</li>
				</ul>
			</p>
			<p>
				You lose if:
				<ul>
					<li>your current total totals over 21</li>
					<li>
						your current total is &lt; 21 but lower than the House’s total
					</li>
					<li>you tie with the House</li>
				</ul>
			</p>
			<p className='videos-header'>Video instructions:</p>
			<div className='embed-video'>
				<iframe
					width={560}
					height={315}
					src='https://www.youtube.com/embed/PljDuynF-j0?si=zGc2Ic3xmYLNsQQM'
					title='YouTube video player'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
					allowFullScreen
				/>
			</div>
			<div className='embed-video'>
				<iframe
					width={560}
					height={315}
					src='https://www.youtube.com/embed/ZApzTKZV0Ro?si=ReFZ_epqpwLRChiC'
					title='YouTube video player'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
					allowFullScreen
				/>
			</div>
			<div className='embed-video'>
				<iframe
					width={560}
					height={315}
					src='https://www.youtube.com/embed/xjqTIzYkGdI?si=7R3134JGX6bUsbkR'
					title='YouTube video player'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
					allowFullScreen
				/>
			</div>
		</div>
	)
}

export default Instructions
