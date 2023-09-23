export function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

export function generateIdFromAddresses(address1, address2) {
    // Sort addresses lexicographically and concatenate
    const sortedAddresses = [address1, address2].sort().join('');
    return simpleHash(sortedAddresses);
}