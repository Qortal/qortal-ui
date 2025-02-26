export const mimeToExtensionMap = {
	// Documents
	"application/pdf": ".pdf",
	"application/msword": ".doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
	"application/vnd.ms-excel": ".xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
	"application/vnd.ms-powerpoint": ".ppt",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
	"application/vnd.oasis.opendocument.text": ".odt",
	"application/vnd.oasis.opendocument.spreadsheet": ".ods",
	"application/vnd.oasis.opendocument.presentation": ".odp",
	"text/plain": ".txt",
	"text/csv": ".csv",
	"text/html": ".html",
	"application/xhtml+xml": ".xhtml",
	"application/xml": ".xml",
	"application/json": ".json",

	// Images
	"image/jpeg": ".jpg",
	"image/png": ".png",
	"image/gif": ".gif",
	"image/webp": ".webp",
	"image/svg+xml": ".svg",
	"image/tiff": ".tif",
	"image/bmp": ".bmp",

	// Audio
	"audio/mpeg": ".mp3",
	"audio/ogg": ".ogg",
	"audio/wav": ".wav",
	"audio/webm": ".weba",
	"audio/aac": ".aac",

	// Video
	"video/mp4": ".mp4",
	"video/webm": ".webm",
	"video/ogg": ".ogv",
	"video/x-msvideo": ".avi",
	"video/quicktime": ".mov",
	"video/x-ms-wmv": ".wmv",
	"video/mpeg": ".mpeg",
	"video/3gpp": ".3gp",
	"video/3gpp2": ".3g2",
	"video/x-matroska": ".mkv",
	"video/x-flv": ".flv",

	// Archives
	"application/zip": ".zip",
	"application/x-rar-compressed": ".rar",
	"application/x-tar": ".tar",
	"application/x-7z-compressed": ".7z",
	"application/x-gzip": ".gz",
	"application/x-bzip2": ".bz2",
}

export const parseQortalLink = (link) => {
	const prefix = "qortal://use-embed/"

	let params = {}

	if (!link.startsWith(prefix)) {
		throw new Error("Invalid link format")
	}

	const [typePart, queryPart] = link.slice(prefix.length).split("?")
	const type = typePart.split("/")[0].toUpperCase()

	if (queryPart) {
		const queryPairs = queryPart.split("&")
		queryPairs.forEach((pair) => {
			const [key, value] = pair.split("=")
			if (key && value) {
				const decodedKey = decodeURIComponent(key.trim())
				const decodedValue = value.trim().replace(/<\/?[^>]+(>|$)/g,"")
				params[decodedKey] = decodedValue
			}
		})
	}

	return { type, ...params }
}

export const extensionToPointer = (repString) => {
	const replace00 = repString.split('qortal://use-embed/').join('<newpointer>qortal://use-embed/')
	const replace01 = replace00.split('.pdf').join('.pdf</newpointer>')
	const replace02 = replace01.split('.doc').join('.doc</newpointer>')
	const replace03 = replace02.split('.xls').join('.xls</newpointer>')
	const replace04 = replace03.split('.ppt').join('.ppt</newpointer>')
	const replace05 = replace04.split('.odt').join('.odt</newpointer>')
	const replace06 = replace05.split('.ods').join('.ods</newpointer>')
	const replace07 = replace06.split('.odp').join('.odp</newpointer>')
	const replace08 = replace07.split('.txt').join('.txt</newpointer>')
	const replace09 = replace08.split('.csv').join('.csv</newpointer>')
	const replace10 = replace09.split('.html').join('.html</newpointer>')
	const replace11 = replace10.split('.xml').join('.xml</newpointer>')
	const replace12 = replace11.split('.json').join('.json</newpointer>')
	const replace13 = replace12.split('.jpg').join('.jpg</newpointer>')
	const replace14 = replace13.split('.png').join('.png</newpointer>')
	const replace15 = replace14.split('.gif').join('.gif</newpointer>')
	const replace16 = replace15.split('.webp').join('.webp</newpointer>')
	const replace17 = replace16.split('.svg').join('.svg</newpointer>')
	const replace18 = replace17.split('.tif').join('.tif</newpointer>')
	const replace19 = replace18.split('.bmp').join('.bmp</newpointer>')
	const replace20 = replace19.split('.mp3').join('.mp3</newpointer>')
	const replace21 = replace20.split('.ogg').join('.ogg</newpointer>')
	const replace22 = replace21.split('.wav').join('.wav</newpointer>')
	const replace23 = replace22.split('.webm').join('.webm</newpointer>')
	const replace24 = replace23.split('.ogv').join('.ogv</newpointer>')
	const replace25 = replace24.split('.avi').join('.avi</newpointer>')
	const replace26 = replace25.split('.mov').join('.mov</newpointer>')
	const replace27 = replace26.split('.wmv').join('.wmv</newpointer>')
	const replace28 = replace27.split('.mpeg').join('.mpeg</newpointer>')
	const replace29 = replace28.split('.3gp').join('.3gp</newpointer>')
	const replace30 = replace29.split('.3g2').join('.3g2</newpointer>')
	const replace31 = replace30.split('.mkv').join('.mkv</newpointer>')
	const replace32 = replace31.split('.flv').join('.flv</newpointer>')
	const replace33 = replace32.split('.zip').join('.zip</newpointer>')
	const replace34 = replace33.split('.rar').join('.rar</newpointer>')
	const replace35 = replace34.split('.tar').join('.tar</newpointer>')
	const replace36 = replace35.split('.7z').join('.7z</newpointer>')
	const replace37 = replace36.split('.gz').join('.gz</newpointer>')
	const replace38 = replace37.split('.bz2').join('.bz2</newpointer>')
	const replace39 = replace38.split('service=QCHAT_IMAGE</p>').join('service=QCHAT_IMAGE</newpointer></p>')

	return replace39
}

export const encodedToChar = (encodedString) => {
	const encode01 = encodedString.split('&amp;').join('&')
	const encode02 = encode01.split('&nbsp;').join(' ')
	const encode03 = encode02.split('&lt;').join('<')
	const encode04 = encode03.split('&gt;').join('>')
	const encode05 = encode04.split('&quot;').join('"')
	const encode06 = encode05.split('%20').join(' ')
	const encode07 = encode06.split('%23').join('#')
	const encode08 = encode07.split('%24').join('$')
	const encode09 = encode08.split('%26').join('&')
	const encode10 = encode09.split('%2B').join('+')
	const encode11 = encode10.split('%2C').join(',')
	const encode12 = encode11.split('%2F').join('/')
	const encode13 = encode12.split('%3A').join(':')
	const encode14 = encode13.split('%3B').join(';')
	const encode15 = encode14.split('%3D').join('=')
	const encode16 = encode15.split('%3F').join('?')
	const encode17 = encode16.split('%40').join('@')

	return encode17
}

export const embedToString = (embed) => {
	let embedString = ''
	let embedService = ''
	let embedName = ''
	let embedIdentifier = ''
	let embedAttachmentName = ''

	if (embed.type === "IMAGE") {
		embedService = embed.service
		embedName = embed.name
		embedIdentifier = embed.identifier
		embedString = '"images":[{"service":"' + embedService + '","name":"' + embedName + '","identifier":"' + embedIdentifier + '"}],"isImageDeleted":false'
	} else if (embed.type === "ATTACHMENT") {
		embedService = embed.service
		embedName = embed.name
		embedIdentifier = embed.identifier
		embedAttachmentName = embed.fileName
		embedString = '"attachments":[{"service":"' + embedService + '","name":"' + embedName + '","identifier":"' + embedIdentifier + '","attachmentName":"' + embedAttachmentName + '","attachmentSize":0}],"isAttachmentDeleted":false'
	} else {
		embedString = '"images":[""]'
	}

	return embedString
}


export const listOfAllQortalRequests = [
	'IS_USING_GATEWAY',
	'ADMIN_ACTION',
	'SHOW_ACTIONS',
	'CREATE_AND_COPY_EMBED_LINK',
	'GET_USER_ACCOUNT',
	'REGISTER_NAME',
	'UPDATE_NAME',
	'ENCRYPT_DATA',
	'DECRYPT_DATA',
	'ENCRYPT_QORTAL_GROUP_DATA',
	'DECRYPT_QORTAL_GROUP_DATA',
	'ENCRYPT_DATA_WITH_SHARING_KEY',
	'DECRYPT_DATA_WITH_SHARING_KEY',
	'DECRYPT_AESGCM',
	'CREATE_TRADE_BUY_ORDER',
	'CREATE_TRADE_SELL_ORDER',
	'CANCEL_TRADE_SELL_ORDER',
	'GET_LIST_ITEMS',
	'ADD_LIST_ITEMS',
	'DELETE_LIST_ITEM',
	'GET_FRIENDS_LIST',
	'LINK_TO_QDN_RESOURCE',
	'QDN_RESOURCE_DISPLAYED',
	'SET_TAB_NOTIFICATIONS',
	'PUBLISH_QDN_RESOURCE',
	'PUBLISH_MULTIPLE_QDN_RESOURCES',
	'VOTE_ON_POLL',
	'CREATE_POLL',
	'OPEN_NEW_TAB',
	'NOTIFICATIONS_PERMISSION',
	'SEND_LOCAL_NOTIFICATION',
	'SEND_CHAT_MESSAGE',
	'JOIN_GROUP',
	'LEAVE_GROUP',
	'INVITE_TO_GROUP',
	'CANCEL_GROUP_INVITE',
	'KICK_FROM_GROUP',
	'BAN_FROM_GROUP',
	'CANCEL_GROUP_BAN',
	'ADD_GROUP_ADMIN',
	'REMOVE_GROUP_ADMIN',
	'SAVE_FILE',
	'GET_HOSTED_DATA',
	'DELETE_HOSTED_DATA',
	'DEPLOY_AT',
	'GET_PROFILE_DATA',
	'SET_PROFILE_DATA',
	'OPEN_PROFILE',
	'GET_USER_WALLET',
	'GET_WALLET_BALANCE',
	'GET_USER_WALLET_INFO',
	'GET_CROSSCHAIN_SERVER_INFO',
	'GET_TX_ACTIVITY_SUMMARY',
	'GET_FOREIGN_FEE',
	'UPDATE_FOREIGN_FEE',
	'GET_SERVER_CONNECTION_HISTORY',
	'SET_CURRENT_FOREIGN_SERVER',
	'ADD_FOREIGN_SERVER',
	'REMOVE_FOREIGN_SERVER',
	'GET_DAY_SUMMARY',
	'SIGN_TRANSACTION',
	'SEND_COIN'
]
