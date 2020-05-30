import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import User from '../../../models/User'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useImageUrl from '../../../hooks/useImageUrl'
import useAuthModal from '../../../hooks/useAuthModal'
import Stars from '../../shared/Stars'
import Button from '../../shared/Button'
import { formatNumber, handleError } from '../../../utils'

import { ReactComponent as UserIcon } from '../../../images/icons/user.svg'
import { ReactComponent as DownloadIcon } from '../../../images/icons/download.svg'
import { ReactComponent as UsersIcon } from '../../../images/icons/users.svg'

export default ({ deck }: { deck: Deck }) => {
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
	const [imageUrl] = useImageUrl(deck)
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const hasDeck = decks.some(({ id }) => id === deck.id)
	
	const get = async () => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)
				
				await deck.get(user.id)
				
				setGetLoadingState(LoadingState.Success)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}
	
	const open = () =>
		history.push(`/decks/${deck.slugId}/${deck.slug}`)
	
	return (
		<Link
			to={deck.url}
			className="deck-row"
			itemScope
			itemID={deck.id}
			itemType="https://schema.org/IndividualProduct"
		>
			<img
				itemProp="image"
				src={imageUrl ?? Deck.DEFAULT_IMAGE_URL}
				alt={deck.name}
			/>
			<div className="content">
				<p className="name" itemProp="name">
					{deck.name}
				</p>
				<p className="subtitle">
					{deck.subtitle}
				</p>
				<p hidden itemProp="description">
					{deck.description}
				</p>
				{deck.creatorName && (
					<div className="creator">
						<UserIcon />
						<p>{deck.creatorName}</p>
					</div>
				)}
			</div>
			<div className="footer">
				<div className="stats">
					<div
						className="rating"
						itemProp="aggregateRating"
						itemScope
						itemType="https://schema.org/AggregateRating"
					>
						<meta itemProp="ratingValue" content={deck.averageRating.toString()} />
						<meta itemProp="reviewCount" content={(deck.numberOfRatings || 1).toString()} />
						<meta itemProp="worstRating" content={deck.worstRating.toString()} />
						<meta itemProp="bestRating" content={deck.bestRating.toString()} />
						<Stars>{deck.averageRating}</Stars>
						<p>({formatNumber(deck.numberOfRatings)})</p>
					</div>
					<div className="divider" />
					<div className="downloads">
						<DownloadIcon />
						<p>({formatNumber(deck.numberOfDownloads)})</p>
					</div>
					<div className="divider" />
					<div className="current-users">
						<UsersIcon />
						<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
					</div>
					<div className="divider" />
					<p className="cards">
						{formatNumber(deck.numberOfCards)} card{deck.numberOfCards === 1 ? '' : 's'}
					</p>
				</div>
				<Button
					className={hasDeck ? 'open' : 'get'}
					loaderSize="16px"
					loaderThickness="3px"
					loaderColor="white"
					loading={getLoadingState === LoadingState.Loading}
					disabled={false}
					onClick={event => {
						event.preventDefault()
						hasDeck ? open() : get()
					}}
				>
					{hasDeck ? 'Open' : 'Get'}
				</Button>
			</div>
		</Link>
	)
}