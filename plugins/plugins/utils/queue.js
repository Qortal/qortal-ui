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

export class RequestQueueWithPromise {
    constructor(maxConcurrent = 5) {
      this.queue = [];
      this.maxConcurrent = maxConcurrent;
      this.currentlyProcessing = 0;
    }

    // Add a request to the queue and return a promise
    enqueue(request) {
      return new Promise((resolve, reject) => {
        // Push the request and its resolve and reject callbacks to the queue
        this.queue.push({ request, resolve, reject });
        this.process();
      });
    }

    // Process requests in the queue
    async process() {
      while (this.queue.length > 0 && this.currentlyProcessing < this.maxConcurrent) {
        this.currentlyProcessing++;
        const { request, resolve, reject } = this.queue.shift();
        try {
          const response = await request();
          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          this.currentlyProcessing--;
          await this.process();
        }
      }
    }
  }




