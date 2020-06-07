import React, { memo, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import useCramState from './useCramState'
import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'

import '../../../scss/components/Dashboard/Cram.scss'

const CramContent = () => {
	const { slugId, slug, sectionId } = useParams()
	const {
		deck,
		section,
		card,
		currentIndex,
		count,
		loadingState,
		shouldShowRecap,
		skip,
		rate
	} = useCramState(slugId, slug, sectionId)
	
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	
	const toggleIsWaitingForRating = useCallback(() => {
		setIsWaitingForRating(isWaitingForRating => !isWaitingForRating)
	}, [setIsWaitingForRating])
	
	const backUrl = `/decks/${slugId}/${slug}`
	
	return (
		<div className="mask" onClick={toggleIsWaitingForRating}>
			<Navbar
				backUrl={backUrl}
				currentIndex={currentIndex}
				count={count}
				skip={skip}
				recap={() => undefined}
			/>
			<Sliders
				mastered={0}
				seen={0}
				unseen={0}
				total={0}
			/>
			<CardContainer
				deck={deck}
				section={section}
				card={card && card.value}
			/>
			<Footer
				isWaitingForRating={isWaitingForRating}
				rate={rate}
			/>
		</div>
	)
}

export default memo(CramContent)