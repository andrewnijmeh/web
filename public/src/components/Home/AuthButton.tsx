import React, { memo } from 'react'

import Base from '../shared/AuthButton'

import '../../scss/components/Home/AuthButton.scss'

const AuthButton = () => (
	<Base className="auth-button">
		Log in <span>/</span> Sign up
	</Base>
)

export default memo(AuthButton)
