export class RequestQueue {
    constructor(maxConcurrent = 5) {
        this.queue = [];
        this.maxConcurrent = maxConcurrent;
        this.currentConcurrent = 0;
    }

    push(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                request,
                resolve,
                reject,
            });
            this.checkQueue();
        });
    }

    checkQueue() {
        if (this.queue.length === 0 || this.currentConcurrent >= this.maxConcurrent) return;

        const { request, resolve, reject } = this.queue.shift();
        this.currentConcurrent++;

        request()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                this.currentConcurrent--;
                this.checkQueue();
            });
    }
}

