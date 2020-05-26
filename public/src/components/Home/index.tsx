import React from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Screenshots from './Screenshots'
import Features from './Features'
import Classroom from './Classroom'

export default () => (
	<div className="home">
		<TopGradient>
			<Navbar />
			<Header />
		</TopGradient>
		<SpacedRepetition />
		<Screenshots />
		<Features />
		<Classroom />
	</div>
)
