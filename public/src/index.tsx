import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import AOS from 'aos'

import * as serviceWorker from './serviceWorker'
import { CurrentUserProvider } from './contexts/CurrentUser'
import { DecksProvider } from './contexts/Decks'
import { DeckImageUrlsProvider } from './contexts/DeckImageUrls'
import { TopicsProvider } from './contexts/Topics'
import { CreateDeckProvider } from './contexts/CreateDeck'
import App from './components/App'
import firebase from './firebase'

import 'firebase/analytics'

import './scss/index.scss'

const analytics = firebase.analytics()
const root = document.getElementById('root') ?? document.body

analytics.logEvent('start')
AOS.init()

Modal.setAppElement(root)

ReactDOM.render((
	<CurrentUserProvider>
		<DecksProvider>
			<DeckImageUrlsProvider>
				<TopicsProvider>
					<CreateDeckProvider>
						<App />
					</CreateDeckProvider>
				</TopicsProvider>
			</DeckImageUrlsProvider>
		</DecksProvider>
	</CurrentUserProvider>
), root)

serviceWorker.register()
