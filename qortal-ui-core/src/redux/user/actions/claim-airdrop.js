import { CLAIM_AIRDROP } from '../user-action-types.js'

export const doClaimAirdrop = (address) => {
    return (dispatch, getState) => {
        dispatch(claimAidrop())
    }
}

const claimAidrop = (payload) => {
    return {
        type: CLAIM_AIRDROP,
        payload
    }
}
