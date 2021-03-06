import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'
import omit from 'lodash/omit'

import Action, { ActionType } from '../actions/Action'
import User from '../models/User'

export type CreatorsState = Record<string, User>

export type CreatorsAction = Action<
	| { uid: string, snapshot: firebase.firestore.DocumentSnapshot } // AddCreator, UpdateCreator
	| string // RemoveCreator
>

const initialState: CreatorsState = {}

const reducer = (state: CreatorsState, { type, payload }: CreatorsAction) => {
	switch (type) {
		case ActionType.UpdateCreator: {
			const { uid, snapshot } = payload as {
				uid: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			const user = state[uid]
			
			return {
				...state,
				[uid]: user
					? user.updateFromSnapshot(snapshot)
					: User.fromSnapshot(snapshot)
			}
		}
		case ActionType.RemoveCreator:
			return omit(state, payload as string)
		default:
			return state
	}
}

const Context = createContext<[CreatorsState, Dispatch<CreatorsAction>]>([
	initialState,
	console.log
])
export default Context

export const CreatorsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
