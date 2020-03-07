import React from 'react'

import Screenshot, { ScreenshotType } from '../shared/Screenshot'

export default () => (
	<div className="home header flex">
		<div className="header-text text-white">
			<h1>
				The ultimate<br />
				memorization app
			</h1>
			<h3>Truly effective flashcards</h3>
		</div>
		<Screenshot type={ScreenshotType.Cram} className="screenshot hidden ml-auto" />
	</div>
)