const glob = require('glob')
const { join } = require('path')
const { getType } = require('mime')

const { storage } = require('../utils/firebase-admin')

const PATH = join(
	__dirname,
	'..',
	'..',
	'public',
	'main',
	'build',
	'static',
	'**',
	'*.*'
)

if (require.main === module)
	(async () => {
		const paths = glob.sync(PATH)
		
		console.log(`Found ${paths.length} assets`)
		
		let i = 0
		
		await Promise.all(paths.map(async path => {
			const name = path.slice(path.lastIndexOf('/') + 1)
			const contentType = getType(path)
			
			if (!contentType)
				throw new Error('Unknown content type')
			
			await storage.upload(path, {
				destination: `public-assets/${name}`,
				contentType
			})
			
			console.log(`Uploaded asset ${++i}/${paths.length} as ${name} (${contentType})`)
		}))
		
		console.log(`Finished uploading ${paths.length} assets`)
	})()
