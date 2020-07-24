import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import ConfirmationForm from '../shared/ConfirmationForm'

import 'firebase/analytics'
import 'firebase/firestore'

const analytics = firebase.analytics()
const firestore = firebase.firestore()

const UnsubscribeContent = () => {
	const { uid, type } = useParams()
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	const onSubmit = useCallback(() => {
		if (!(uid && type))
			return
		
		setLoadingState(LoadingState.Loading)
		analytics.logEvent('unsubscribe', { uid, type })
		
		firestore.doc(`users/${uid}`)
			.update({ [`unsubscribed.${type}`]: true })
			.then(() => setLoadingState(LoadingState.Success))
			.catch(error => {
				setLoadingState(LoadingState.Fail)
				console.error(error)
			})
	}, [uid, type, setLoadingState])
	
	return (
		<ConfirmationForm
			title="Unsubscribe"
			description="Unsubscribe from our mailing list"
			loadingState={loadingState}
			submitMessage="Unsubscribe"
			submitButtonText="Unsubscribe"
			onSubmit={onSubmit}
		/>
	)
}

export default UnsubscribeContent
