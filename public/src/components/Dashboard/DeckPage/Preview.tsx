import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import cx from 'classnames'
import _ from 'lodash'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import Card from '../../../models/Card'
import useAllCards from '../../../hooks/useAllCards'
import useSections from '../../../hooks/useSections'
import CardSide from '../../shared/CardSide'
import Loader from '../../shared/Loader'

import { ReactComponent as ToggleIcon } from '../../../images/icons/toggle.svg'
import { ReactComponent as LeftArrowHead } from '../../../images/icons/gray-left-arrow-head.svg'
import { ReactComponent as RightArrowHead } from '../../../images/icons/gray-right-arrow-head.svg'
import { sleep, formatNumber } from '../../../utils'
import useKeyPress from '../../../hooks/useKeyPress'

const BOX_TRANSFORM_X_LENGTH = 20

export default ({ deck }: { deck: Deck }) => {
	const _sections = [deck.unsectionedSection, ...useSections(deck.id)]
	const sections = _.keyBy(_sections, 'id')
	
	const _cards = useAllCards(deck.id)
	const cards = _cards && _.chain(_cards)
		.toPairs()
		.sort(([a], [b]) =>
			sections[a].index - sections[b].index
		)
		.map('1')
		.flatten()
		.value()
	
	const [card, setCard] = useState(null as Card | null)
	
	const [isFront, setIsFront] = useState(true)
	const [toggleButtonDegrees, setToggleButtonDegrees] = useState(0)
	
	const [boxOpacity, setBoxOpacity] = useState(1)
	const [boxTransform, setBoxTransform] = useState(undefined as string | undefined)
	
	const section = card && sections[card.sectionId]
	const cardIndex = cards?.findIndex(({ id }) => id === card?.id)
	
	const shouldFlip = useKeyPress(38, 40, 32) // Up arrow, down arrow, space
	const shouldGoLeft = useKeyPress(37) // Left arrow
	const shouldGoRight = useKeyPress(39) // Right arrow
	
	const isLeftDisabled = !cardIndex
	const isRightDisabled = cardIndex === undefined || cardIndex >= cards!.length - 1
	
	const setSection = useCallback((section: Section) => {
		const newCard = cards?.find(card => card.sectionId === section.id)
		newCard && setCard(newCard)
	}, [cards])
	
	const toggleSide = async () => {
		setBoxOpacity(0)
		setBoxTransform('translateY(-16px)')
		
		await sleep(150)
		
		setIsFront(!isFront)
		setToggleButtonDegrees(toggleButtonDegrees + 180)
		
		setBoxOpacity(1)
		setBoxTransform(undefined)
	}
	
	const nextCard = async (isRight: boolean) => {
		if (cardIndex === undefined)
			return
		
		const direction = isRight ? 1 : -1
		
		setBoxOpacity(0)
		setBoxTransform(`translateX(${direction * BOX_TRANSFORM_X_LENGTH}px)`)
		
		await sleep(150)
		
		setCard(cards![cardIndex + direction])
		setIsFront(true)
		
		setBoxOpacity(1)
		setBoxTransform(undefined)
	}
	
	useEffect(() => {
		if (card || !cards)
			return
		
		if (deck.numberOfUnsectionedCards > 0)
			return setSection(deck.unsectionedSection)
		
		let i = -1
		
		for (const section of _sections) {
			if (section.index !== i++)
				return // The sections aren't in order, which means they haven't all been loaded
			
			if (section.numberOfCards > 0)
				return setSection(section)
		}
	}, [card, cards, deck, _sections]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldFlip)
			toggleSide()
	}, [shouldFlip]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldGoLeft && !isLeftDisabled)
			nextCard(false)
	}, [shouldGoLeft, isLeftDisabled]) // eslint-disable-line
	
	useEffect(() => {
		if (shouldGoRight && !isRightDisabled)
			nextCard(true)
	}, [shouldGoRight, isRightDisabled]) // eslint-disable-line
	
	return (
		<div className="preview">
			<div>
				<div className="header">
					<Select
						className="section-select"
						options={_sections}
						getOptionLabel={_.property('name')}
						getOptionValue={_.property('id')}
						isOptionDisabled={section => !section.numberOfCards}
						placeholder="Loading..."
						isLoading={!section}
						value={section}
						onChange={setSection as any}
					/>
					<h3 className="message">
						Preview this deck
					</h3>
				</div>
				<button
					className={cx('box', { loading: !card })}
					onClick={toggleSide}
					style={{
						opacity: boxOpacity,
						transform: boxTransform
					}}
				>
					{card
						? (
							<CardSide className="content">
								{card[isFront ? 'front' : 'back']}
							</CardSide>
						)
						: <Loader size="24px" thickness="4px" color="#582efe" />
					}
					<div className="toggle">
						<p className="side">
							{isFront ? 'Front' : 'Back'}
						</p>
						<ToggleIcon
							className="icon"
							style={{
								transform: `scale(2) rotate(${toggleButtonDegrees}deg)`
							}}
						/>
					</div>
				</button>
				<div className="footer">
					<button
						className="left"
						disabled={isLeftDisabled}
						onClick={() => nextCard(false)}
					>
						<LeftArrowHead />
					</button>
					<div className={cx('progress', { disabled: cardIndex === undefined })}>
						<div className="slider">
							<div style={{ width: `${100 * ((cardIndex ?? 0) + 1) / deck.numberOfCards}%` }} />
						</div>
						<p>{formatNumber((cardIndex ?? 0) + 1)} <span>/</span> {formatNumber(deck.numberOfCards)}</p>
					</div>
					<button
						className="right"
						disabled={isRightDisabled}
						onClick={() => nextCard(true)}
					>
						<RightArrowHead />
					</button>
				</div>
			</div>
		</div>
	)
}