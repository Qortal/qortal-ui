
const Base64 = {};



Base64.decode = function (string) {

    const binaryString = atob(string);
    const binaryLength = binaryString.length;
    const bytes = new Uint8Array(binaryLength);

    for (let i = 0; i < binaryLength; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const decoder = new TextDecoder();
    const decodedString = decoder.decode(bytes);
    return decodedString;
};




export default Base64;