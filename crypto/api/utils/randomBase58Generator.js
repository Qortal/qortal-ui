export const randomBase58Generator = (digits) => {
    digits = digits || 0
    let base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.split('')
    let result = ''
    let char
    while (result.length < digits) {
        char = base58[Math.random() * 57 >> 0]
        if (result.indexOf(char) === -1) result += char
    }
    return result
}
