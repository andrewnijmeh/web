import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import User from '../../models/User'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'

import 'firebase/analytics'
import 'firebase/firestore'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

const BlockUserContent = () => {
	const { to: toId, from: fromId } = useParams()
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [from, setFrom] = useState(null as User | null)
	
	const fromName = useMemo(() => (
		from?.name ?? '...'
	), [from])
	
	const onSubmit = useCallback(() => {
		if (!(toId && fromId))
			return
		
		setLoadingState(LoadingState.Loading)
		analytics.logEvent('block-user', { to: toId, from: fromId })
		
		firestore.doc(`users/${toId}/blocked/${fromId}`)
			.set({})
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setLoadingState(LoadingState.Fail)
				console.error(error)
			})
	}, [toId, fromId, setLoadingState])
	
	useEffect(() => {
		firestore.doc(`users/${fromId}`).get()
			.then(snapshot => setFrom(User.fromSnapshot(snapshot)))
	}, [fromId, setFrom])
	
	return (
		<ConfirmationForm
			title={`Block ${fromName}`}
			description={`Block ${fromName} from contacting you on memorize.ai`}
			loadingState={loadingState}
			submitMessage={`Block ${fromName}`}
			submitButtonText="Block"
			onSubmit={onSubmit}
		/>
	)
}

export default BlockUserContent