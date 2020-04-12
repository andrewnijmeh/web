import React, { useState, useEffect, useCallback } from 'react'
import { useHistory, Link } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useQuery from '../../../hooks/useQuery'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import Button from '../../shared/Button'
import Stars from '../../shared/Stars'
import { urlForAuth } from '../../Auth'
import { urlWithQuery, formatNumber } from '../../../utils'

import { ReactComponent as UserIcon } from '../../../images/icons/user.svg'
import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as DownloadIcon } from '../../../images/icons/download.svg'
import { ReactComponent as UsersIcon } from '../../../images/icons/users.svg'

export default (
	{ deck, hasDeck }: {
		deck: Deck
		hasDeck: boolean
	}
) => {
	const history = useHistory()
	const query = useQuery()
	
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const action = query.get('action')
	
	const get = useCallback(async () => {
		if (!currentUser) {
			query.set('action', 'get')
			
			return history.push(urlForAuth({
				title: 'I heard that deck is great...',
				next: urlWithQuery(
					window.location.pathname,
					Object.fromEntries(query)
				)
			}))
		}
		
		try {
			setGetLoadingState(LoadingState.Loading)
			
			await deck[hasDeck ? 'remove' : 'get'](currentUser.id)
			
			setGetLoadingState(LoadingState.Success)
			
			query.delete('action')
			
			history.push(urlWithQuery(
				window.location.pathname,
				Object.fromEntries(query)
			))
		} catch (error) {
			setGetLoadingState(LoadingState.Fail)
			
			alert(error.message)
			console.error(error)
		}
	}, [currentUser, deck, hasDeck, history, query])
	
	useEffect(() => {
		if (action === 'get' && !hasDeck)
			get()
	}, [action, hasDeck, get])
	
	return (
		<div className="header">
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
			<div className="content">
				<div className="top">
					<div className="left">
						<h1 className="name">
							{deck.name}
						</h1>
						<p className="subtitle">
							{deck.subtitle}
						</p>
						{(deck.creatorName = '...') && (
							<div className="creator">
								<UserIcon />
								<p>{deck.creatorName}</p>
							</div>
						)}
					</div>
					<div className="right">
						{hasDeck
							? (
								<>
									<Button
										className="remove"
										loaderSize="16px"
										loaderThickness="3px"
										loaderColor="white"
										loading={getLoadingState === LoadingState.Loading}
										disabled={false}
										onClick={get}
									>
										Remove
									</Button>
									<Link to={`/decks/${deck.slug}`} className="open">
										Open
									</Link>
								</>
							)
							: (
								<Button
									className="get"
									loaderSize="16px"
									loaderThickness="3px"
									loaderColor="white"
									loading={getLoadingState === LoadingState.Loading}
									disabled={false}
									onClick={get}
								>
									Get
								</Button>
							)
						}
						<button className="share" onClick={() => console.log('Share')}>
							<ShareIcon />
						</button>
					</div>
				</div>
				<div className="divider" />
				<div className="stats">
					<a className="rating" href="#ratings">
						<Stars>{deck.averageRating}</Stars>
						<p>({formatNumber(deck.numberOfRatings)})</p>
					</a>
					<div className="divider" />
					<a className="downloads" href="#info">
						<DownloadIcon />
						<p>({formatNumber(deck.numberOfDownloads)})</p>
					</a>
					<div className="divider" />
					<a className="current-users" href="#info">
						<UsersIcon />
						<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
					</a>
					<div className="divider" />
					<a className="cards" href="#cards">
						{formatNumber(deck.numberOfCards)} card{deck.numberOfCards === 1 ? '' : 's'}
					</a>
				</div>
			</div>
		</div>
	)
}