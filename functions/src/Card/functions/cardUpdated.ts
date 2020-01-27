import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Card from '..'
import Deck from '../../Deck'
import { batchWithChunks } from '../../helpers'

const firestore = admin.firestore()

export default functions.firestore
	.document('decks/{deckId}/cards/{cardId}')
	.onUpdate(({ before, after }, { params: { deckId } }) => {
		const oldCard = new Card(before)
		const newCard = new Card(after)
		
		return oldCard.sectionId === newCard.sectionId
			? Promise.resolve()
			: Promise.all([
				oldCard.decrementSectionCardCount(deckId),
				newCard.incrementSectionCardCount(deckId),
				updateUserNodeSections(deckId, oldCard, newCard)
			])
	})

const updateUserNodeSections = (deckId: string, oldCard: Card, newCard: Card) =>
	Deck.currentUsers(deckId).then(async currentUserIds => {
		const documentReferences: FirebaseFirestore.DocumentReference[] = []
		
		await Promise.all(currentUserIds.map(uid =>
			firestore
				.collection(`users/${uid}/decks/${deckId}/cards`)
				.where('section', '==', oldCard.sectionId)
				.get()
				.then(({ docs }) =>
					docs.forEach(({ ref }) =>
						documentReferences.push(ref)
					)
				)
		))
		
		return batchWithChunks(documentReferences, 500, (chunk, batch) => {
			for (const ref of chunk)
				batch.update(ref, { section: newCard.sectionId })
		})
	})
