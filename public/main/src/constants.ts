export const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream

/** Does not include iPads */
export const IS_IOS_HANDHELD = /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

export const LOCAL_STORAGE_EXPECTS_SIGN_IN_KEY = 'ai.memorize.expectsSignIn'
export const LOCAL_STORAGE_IS_CARD_EDITOR_STACKED_KEY = 'ai.memorize.isCardEditorStacked'

export const APP_STORE_URL = 'https://apps.apple.com/app/id1462251805'
export const APP_SCREENSHOT_URL = 'https://memorize.ai/images/screenshots/review.png'
export const SLACK_INVITE_URL = 'https://join.slack.com/t/memorizeai/shared_invite/zt-fonasrkz-~lttgde~yDum5IMiAydXNQ'
export const API_URL = 'https://github.com/memorize-ai/web/blob/master/API.md'

export const ROOT_ELEMENT = document.getElementById('root')

export const DECKS_HOST_IDENTIFIER = 'host-fig55q'
export const DECKS_SEARCH_KEY = 'search-no3fo2msypcfjc1p14upkg1c'
export const DECKS_ENGINE_NAME = 'memorize-ai-decks'

export const DISQUS_SHORTNAME = 'memorize-ai'

export const EMOJIS = ['😃', '😇', '😌', '😘', '🥳', '💪']

export const DEFAULT_DECK_COUNT = '47k'

export const FIRESTORE_BATCH_LIMIT = 500

export const EMAIL_REGEX = /^.+?@.+?\..{2,}$/

export const LONG_DATE_FORMATTER_YEAR = new Intl.DateTimeFormat('en-US', { year: 'numeric' })
export const LONG_DATE_FORMATTER_MONTH = new Intl.DateTimeFormat('en-US', { month: 'short' })
export const LONG_DATE_FORMATTER_DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric' })
