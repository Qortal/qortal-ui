import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-view'
import { friendsViewStyles } from './friends-view-css';
import { connect } from 'pwa-helpers';
import { store } from '../../store';
import './feed-item'
const perEndpointCount = 20;
const totalDesiredCount = 100;
const maxResultsInMemory = 300;
class FriendsFeed extends connect(store)(LitElement) {
    static get properties() {
		return {
			feed: {type: Array}
		};
	}
	constructor(){
		super()
		this.feed = []
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
        this.endpoints = []
        this.endpointOffsets = []  // Initialize offsets for each endpoint to 0

        this.loadAndMergeData = this.loadAndMergeData.bind(this)
	}
	
	static get styles() {
		return [friendsViewStyles];
	}

	getNodeUrl() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	async firstUpdated(){
		console.log('sup')
		const feedData = schema.feed[0]
		let schemaObj = {...schema}
		const dynamicVars = {
			name: 'Phil'
		}
		const getMail = async () => {
			
			const baseurl = `${this.nodeUrl}/arbitrary/resources/search?reverse=true`
			const fullUrl = constructUrl(baseurl, feedData.search, dynamicVars);
            this.endpoints= ['http://127.0.0.1:12391/arbitrary/resources/search?reverse=true&query=-post-&identifier=q-blog-&service=BLOG_POST&exactmatchnames=true&limit=20']
            this.endpointOffsets = Array(this.endpoints.length).fill(0);  // Initialize offsets for each endpoint to 0

			console.log('this.endpoints', this.endpoints)
			const response = await fetch(fullUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()
			return data;
		}
		try {
			getMail()
			const resource = {
				name: 'Phil',
				identifier: 'q-blog-Mugician-post-Love-Explosion-Festival--yJ8kuo'
			}
			// First, evaluate methods to get values for customParams
await updateCustomParamsWithMethods(schemaObj, resource);
console.log({schemaObj})
// Now, generate your final URLs
let clickValue1 = schemaObj.feed[0].click;

const resolvedClickValue1 = replacePlaceholders(clickValue1, resource, schemaObj.feed[0].customParams);

console.log(resolvedClickValue1);
this.loadAndMergeData();


		} catch (error) {
			console.log(error)
		}
	}

     async fetchDataFromEndpoint(endpointIndex, count) {
        const offset = this.endpointOffsets[endpointIndex];
        const url = `${this.endpoints[endpointIndex]}&limit=${count}&offset=${offset}`;
        return fetch(url).then(res => res.json());
    }
    
    
    async  initialLoad() {
        let results = [];
        let totalFetched = 0;
        let i = 0;
        let madeProgress = true;
        let exhaustedEndpoints = new Set();
    
        while (totalFetched < totalDesiredCount && madeProgress) {
            madeProgress = false;
    
            for (i = 0; i < this.endpoints.length; i++) {
                if (exhaustedEndpoints.has(i)) {
                    continue;
                }
    
                const remainingCount = totalDesiredCount - totalFetched;
                
                // If we've already reached the desired count, break
                if (remainingCount <= 0) {
                    break;
                }
    
                let fetchCount = Math.min(perEndpointCount, remainingCount);
                let data = await this.fetchDataFromEndpoint(i, fetchCount);
                
                // Increment the offset for this endpoint by the number of items fetched
                this.endpointOffsets[i] += data.length;
    
                if (data.length > 0) {
                    madeProgress = true;
                }
    
                if (data.length < fetchCount) {
                    exhaustedEndpoints.add(i);
                }
    
                results = results.concat(data);
                totalFetched += data.length;
            }
    
            if (exhaustedEndpoints.size === this.endpoints.length) {
                break;
            }
        }
    
        // Trim the results if somehow they are over the totalDesiredCount
        return results.slice(0, totalDesiredCount);
    }
    
    
    
    
    
     trimDataToLimit(data, limit) {
        return data.slice(0, limit);
    }
    
     mergeData(newData, existingData) {
        const existingIds = new Set(existingData.map(item => item.identifier));  // Assume each item has a unique 'id'
        const uniqueNewData = newData.filter(item => !existingIds.has(item.identifier));
        return uniqueNewData.concat(existingData);
    }
    
    
    async  loadAndMergeData() {
        let allData = this.feed
        const newData = await this.initialLoad();
        allData = this.mergeData(newData, allData);
        allData.sort((a, b) => new Date(b.created) - new Date(a.created));  // Sort by timestamp, most recent first
        allData = this.trimDataToLimit(allData, maxResultsInMemory);  // Trim to the maximum allowed in memory
        this.feed = [...allData]
    }
    

	render() {
		console.log('ron', this.feed)
		return html`
			<div class="container">
				<div id="viewElement" class="container-body" style=${"position: relative"}>

					${this.feed.map((item) => {
						return html`<feed-item
					.resource=${{
						name: item.name,
						service: item.service,
						identifier: item.identifier,
					}}
				></feed-item>`;
					})}
					<div id="downObserver"></div>
				</div>
			</div>
		`;
	}

}

customElements.define('friends-feed', FriendsFeed);

export function substituteDynamicVar(value, dynamicVars) {
    if (typeof value !== 'string') return value;

    const pattern = /\$\$\{([a-zA-Z0-9_]+)\}\$\$/g;  // Adjusted pattern to capture $${name}$$ with curly braces

    return value.replace(pattern, (match, p1) => {
        return dynamicVars[p1] !== undefined ? dynamicVars[p1] : match;
    });
}

export function constructUrl(base, search, dynamicVars) {
    let queryStrings = [];

    for (const [key, value] of Object.entries(search)) {
        const substitutedValue = substituteDynamicVar(value, dynamicVars);
        queryStrings.push(`${key}=${encodeURIComponent(substitutedValue)}`);
    }

    return queryStrings.length > 0 ? `${base}&${queryStrings.join('&')}` : base;
}

function executeMethodInWorker(methodString, externalArgs) {
    return new Promise((resolve, reject) => {
        const workerFunction = `
            self.onmessage = function(event) {
                const method = ${methodString};
                const result = method(event.data.externalArgs);
                self.postMessage(result);
            }
        `;

        const blob = new Blob([workerFunction], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        const worker = new Worker(blobURL);

        worker.onmessage = function(event) {
            resolve(event.data);
            worker.terminate();
            URL.revokeObjectURL(blobURL);
        };

        worker.onerror = function(error) {
            reject(error);
            worker.terminate();
            URL.revokeObjectURL(blobURL);
        };

        worker.postMessage({ externalArgs });
    });
}



export async function updateCustomParamsWithMethods(schema,resource) {
    for (const key in schema.feed[0].customParams) {
        const value = schema.feed[0].customParams[key];
        
        if (value.startsWith("**methods.") && value.endsWith("**")) {
            const methodInvocation = value.slice(10, -2).split('(');
            const methodName = methodInvocation[0];

            if (schema.feed[0].methods[methodName]) {
				const methodResult = await executeMethodInWorker(schema.feed[0].methods[methodName].toString(), resource);
				console.log({methodResult})
                schema.feed[0].customParams[key] = methodResult;
            }
        }
    }
}

export function replacePlaceholders(template, resource, customParams) {
    const dataSource = { resource, customParams };
    
    return template.replace(/\$\$\{(.*?)\}\$\$/g, (match, p1) => {
        const keys = p1.split('.');
        let value = dataSource;

        for (let key of keys) {
            if (value[key] !== undefined) {
                value = value[key];
            } else {
                return match;  // Return placeholder unchanged
            }
        }
        return value;
    });
}





export const schema = {
    name: "Q-Blog",
    defaultFeedIndex: 0,
    feed: [
        {
            id:"post-creation",
			version: 1,
            updated: 1696646223261,
            title: "Q-Blog Post creations",
            description: "blablabla",
            search: {
                name:"$${name}$$",
                query: "-post-",
                identifier: "q-blog-",
                service: "BLOG_POST",
				exactmatchnames: true
            },
            click: "qortal://APP/Q-Blog/$${resource.name}$$/$${customParams.blogId}$$/$${customParams.shortIdentifier}$$",
            display: {
                title: "$${rawdata.title}$$",
                description: "$${rawdata.description}$$",
                coverImage: "$${rawdata.image}$$"
            },
            customParams: {
                blogId: "**methods.getBlogId(resource)**",
                shortIdentifier: "**methods.getShortId(resource)**"
            },
            methods: {
                getShortId: function(resource) {
                    const str = resource.identifier
                    const arr = str.split('-post-')
                    const shortIdentifier = arr[1]
                   
                    return shortIdentifier
                },
				getBlogId: function(resource) {
                    const str = resource.identifier
                    const arr = str.split('-post-')
                    const id = arr[0]
                    let blogId = ""
                    if (id.startsWith('q-blog-')) {
                        blogId = id.substring(7);
                    } else {
                        blogId= id;
                    }
                    return blogId
                }
            }
        }
    ]
}