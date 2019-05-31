import * as admin from 'firebase-admin'

import Permission, { PermissionRole, PermissionStatus } from './Permission'

const firestore = admin.firestore()

export default class Invite {
	id: string
	role: PermissionRole
	date: Date
	confirmed?: Date
	status: PermissionStatus
	sender: string

	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.get('id')
		this.role = snapshot.get('role')
		this.date = snapshot.get('date')
		this.confirmed = snapshot.get('confirmed')
		this.status = Permission.status(snapshot.get('status'))
		this.sender = snapshot.get('sender')
	}

	static fromId(id: string): Promise<Invite> {
		return firestore.doc(`invites/${id}`).get().then(invite =>
			invite.exists
				? firestore.doc(`users/${invite.get('uid')}/invites/${invite.get('deckId')}`).get().then(inviteSnapshot =>
					new Invite(inviteSnapshot)
				)
				: Promise.reject()
		)
	}

	static newId(): string {
		return [...Array(32)].map(_i => (~~(Math.random() * 36)).toString(36)).join('')
	}

	static url(id: string): string {
		return `https://memorize.ai/invites/${id}`
	}
}