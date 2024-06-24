import { supportsEmojiFlags } from './ChatTestEmojiFlags'

export function supportCountryFlagEmojis(fontName = "Twemoji Country Flags", fontUrl = "/font/TwemojiCountryFlags.woff2") {
	if (typeof window !== "undefined" && supportsEmojiFlags("😊") && !supportsEmojiFlags("🇨🇭")) {
		const style = document.createElement("style")

		style.textContent = `@font-face {
			font-family: "${fontName}";
			unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067, U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
			src: url('${fontUrl}') format('woff2');
			font-display: swap;
		}`

		document.head.appendChild(style)

		return true
	}

	return false
}