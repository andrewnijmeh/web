import React, { HTMLAttributes } from 'react'

export enum LogoType {
	Capital = 'capital.png'
}

export default ({ type, ...props }: { type: LogoType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/logos/${type}`)} alt="Logo" />
)