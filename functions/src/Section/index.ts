import * as admin from 'firebase-admin'

import { batchWithChunks } from '../helpers'

const firestore = admin.firestore()

export default class Section {
	static unsectionedId = ''
	
	id: string
	name: string
	numberOfCards: number
	
	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.name = snapshot.get('name')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
	}
	
	static fromId = (sectionId: string, deckId: string) =>
		firestore.doc(`decks/${deckId}/sections/${sectionId}`).get().then(snapshot =>
			new Section(snapshot)
		)
	
	deleteCards = (deckId: string) =>
		firestore
			.collection(`decks/${deckId}/cards`)
			.where('section', '==', this.id)
			.get()
			.then(({ docs: cards }) =>
				batchWithChunks(cards, 500, (chunk, batch) => {
					for (const { ref } of chunk)
						batch.delete(ref)
				})
			)
}
