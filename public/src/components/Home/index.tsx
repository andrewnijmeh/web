import React from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'

export default () => (
	<div className="home">
		<TopGradient>
			<Navbar />
			<Header />
		</TopGradient>
		<SpacedRepetition />
	</div>
)
