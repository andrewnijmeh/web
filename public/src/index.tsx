import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import { CurrentUserProvider } from './contexts/CurrentUser'
import { DecksProvider } from './contexts/Decks'
import { SectionsProvider } from './contexts/Sections'
import { CardsProvider } from './contexts/Cards'
import { SimilarDecksProvider } from './contexts/SimilarDecks'
import { TopicsProvider } from './contexts/Topics'
import { CreateDeckProvider } from './contexts/CreateDeck'
import { ExpandedSectionsProvider } from './contexts/ExpandedSections'
import { CountersProvider } from './contexts/Counters'
import { SearchProvider } from './contexts/Search'
import { AuthModalProvider } from './contexts/AuthModal'
import { CreatorsProvider } from './contexts/Creators'
import { AddCardsProvider } from './contexts/AddCards'
import App from './components/App'
import firebase from './firebase'
import { ROOT_ELEMENT } from './constants'

import 'firebase/analytics'

import './scss/index.scss'

const analytics = firebase.analytics()

analytics.logEvent('start')

ReactDOM.render((
	<StrictMode>
		<CurrentUserProvider>
			<DecksProvider>
				<SectionsProvider>
					<CardsProvider>
						<SimilarDecksProvider>
							<TopicsProvider>
								<CreateDeckProvider>
									<ExpandedSectionsProvider>
										<CountersProvider>
											<SearchProvider>
												<AuthModalProvider>
													<CreatorsProvider>
														<AddCardsProvider>
															<App />
														</AddCardsProvider>
													</CreatorsProvider>
												</AuthModalProvider>
											</SearchProvider>
										</CountersProvider>
									</ExpandedSectionsProvider>
								</CreateDeckProvider>
							</TopicsProvider>
						</SimilarDecksProvider>
					</CardsProvider>
				</SectionsProvider>
			</DecksProvider>
		</CurrentUserProvider>
	</StrictMode>
), ROOT_ELEMENT)

serviceWorker.register()
