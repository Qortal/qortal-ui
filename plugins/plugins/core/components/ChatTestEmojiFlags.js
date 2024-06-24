const FONT_FAMILY = '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif'

function makeCtx() {
	const canvas = document.createElement("canvas")
	canvas.width = canvas.height = 1

	const ctx = canvas.getContext("2d", { willReadFrequently: true })

	ctx.textBaseline = "top"
	ctx.font = `100px ${FONT_FAMILY}`
	ctx.scale(0.01, 0.01)

	return ctx
}

function getColor(ctx, text, color) {
	ctx.clearRect(0, 0, 100, 100)
	ctx.fillStyle = color
	ctx.fillText(text, 0, 0)

	const bytes = ctx.getImageData(0, 0, 1, 1).data

	return bytes.join(",")
}

export function supportsEmojiFlags(text) {
	const ctx = makeCtx()
	const white = getColor(ctx, text, "#fff")
	const black = getColor(ctx, text, "#000")

	return black === white && !black.startsWith("0,0,0,")
}