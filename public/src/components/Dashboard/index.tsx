import React, { PropsWithChildren, useEffect } from 'react'
import cx from 'classnames'

import Sidebar from './Sidebar'
import Navbar from './Navbar'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardNavbarSelection {
	Home = 'Home',
	Market = 'Market',
	Decks = 'Decks',
	Interests = 'Interests'
}

export default (
	{ selection, className, gradientHeight, children }: PropsWithChildren<{
		selection: DashboardNavbarSelection
		className: string
		gradientHeight: string
	}>
) => {
	useEffect(() => {
		const { body } = document
		
		body.classList.add('clipped')
		
		return () => body.classList.remove('clipped')
	}, [])
	
	return (
		<div className="dashboard">
			<Sidebar />
			<div className="content">
				<div className="background" style={{ height: gradientHeight }} />
				<div className="container">
					<Navbar selection={selection} />
					<div className={cx('foreground', className)}>
						{children}
					</div>
				</div>
			</div>
		</div>
	)
}
