import { Epml } from '../../../epml.js'
import { EpmlWorkerPlugin } from 'epml'

import { INIT_WORKERS } from '../app-action-types.js'
Epml.registerPlugin(EpmlWorkerPlugin)

export const doInitWorkers = (numberOfWorkers, workerURL) => {
    const workers = []
    return (dispatch, getState) => {
        dispatch(initWorkers())
        try {
            for (let i = 0; i < numberOfWorkers; i++) {
                workers.push(new Epml({ type: 'WORKER', source: new Worker(workerURL) }))
            }
            Promise.all(workers.map(workerEpml => workerEpml.ready()))
                .then(() => {
                    dispatch(initWorkers('success', workers))
                })
        } catch (e) {
            dispatch(initWorkers('error', e))
        }
    }
}
const initWorkers = (status, payload) => {
    return {
        type: INIT_WORKERS,
        status,
        payload
    }
}
