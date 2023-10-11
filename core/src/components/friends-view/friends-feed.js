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
			feed: {type: Array},
            setHasNewFeed: {attribute:false}
		};
	}
	constructor(){
		super()
		this.feed = []
        this.feedToRender = []
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
        this.endpoints = []
        this.endpointOffsets = []  // Initialize offsets for each endpoint to 0
       
        this.loadAndMergeData = this.loadAndMergeData.bind(this)
        this.hasInitialFetch = false
        this.observerHandler = this.observerHandler.bind(this);
        this.elementObserver = this.elementObserver.bind(this)

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
        this.viewElement = this.shadowRoot.getElementById('viewElement');
		this.downObserverElement =
			this.shadowRoot.getElementById('downObserver');
		this.elementObserver();
		const feedData = schema.feed[0]
		let schemaObj = {...schema}
		const dynamicVars = {
			
		}
		const getEndpoints = async () => {
			
			const baseurl = `${this.nodeUrl}/arbitrary/resources/search?reverse=true`
			const fullUrl = constructUrl(baseurl, feedData.search, dynamicVars);
            this.endpoints= [{url: fullUrl, schemaName: schema.name, schema: feedData }]
            this.endpointOffsets = Array(this.endpoints.length).fill(0);  

			
		}
		try {
			getEndpoints()

this.loadAndMergeData();


		} catch (error) {
			console.log(error)
		}
	}

    getMoreFeed(){
        if(!this.hasInitialFetch) return
        if(this.feedToRender.length === this.feed.length ) return
        this.feedToRender = this.feed.slice(0, this.feedToRender.length + 20)
        this.requestUpdate()
    }


	elementObserver() {
		const options = {
			rootMargin: '0px',
			threshold: 1,
		};
		// identify an element to observe
		const elementToObserve = this.downObserverElement;
		// passing it a callback function
		const observer = new IntersectionObserver(
			this.observerHandler,
			options
		);
		// call `observe()` on that MutationObserver instance,
		// passing it the element to observe, and the options object
		observer.observe(elementToObserve);
	}

	observerHandler(entries) {
		if (!entries[0].isIntersecting) {
			return;
		} else {
			if (this.feedToRender.length < 20) {
				return;
			}
			this.getMoreFeed();
		}
	}

     async fetchDataFromEndpoint(endpointIndex, count) {
        const offset = this.endpointOffsets[endpointIndex];
        const url = `${this.endpoints[endpointIndex].url}&limit=${count}&offset=${offset}`;
        const res = await fetch(url)
        const data = await res.json()
        return data.map((i)=> {
            return {
                ...this.endpoints[endpointIndex],
                ...i
            }
        })
       
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


   async addExtraData(data){
        let newData = []
        for (let item of data) {
            let newItem = {
                ...item,
                schema: {
                    ...item.schema,
                    customParams: {...item.schema.customParams}

                }
            }
            let newResource = {
                identifier: newItem.identifier,
                service: newItem.service,
                name: newItem.name
            }
            if(newItem.schema){
                const resource = newItem
                // First, evaluate methods to get values for customParams
        await updateCustomParamsWithMethods(newItem.schema, newResource);
        // Now, generate your final URLs
        let clickValue1 = newItem.schema.click;
        
        const resolvedClickValue1 = replacePlaceholders(clickValue1, resource, newItem.schema.customParams);
        newItem.link = resolvedClickValue1
        newData.push(newItem)
            }
        }
      return newData
  
    }
    
    async  loadAndMergeData() {
        let allData = this.feed
        const newData = await this.initialLoad();
        allData = await this.addExtraData(newData)
        allData = this.mergeData(newData, allData);
        allData.sort((a, b) => new Date(b.created) - new Date(a.created));  // Sort by timestamp, most recent first
        allData = this.trimDataToLimit(allData, maxResultsInMemory);  // Trim to the maximum allowed in memory
        this.feed = [...allData]
        this.feedToRender = this.feed.slice(0,20)
        this.hasInitialFetch = true
        if(allData.length > 0){
            const created = allData[0].created
            let value = localStorage.getItem('lastSeenFeed')
			if (((+value || 0) < created)) {
				this.setHasNewFeed(true)
			}
        }
    }



   

	render() {
		return html`
			<div class="container">
				<div id="viewElement" class="container-body" style=${"position: relative"}>

					${this.feedToRender.map((item) => {
						return html`<feed-item
					.resource=${item}
                    appName=${'Q-Blog'}
                    link=${item.link}
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

function validateMethodString(methodString) {
    // Check for IIFE
    const iifePattern = /^\(.*\)\s*\(\)/;
    if (iifePattern.test(methodString)) {
        throw new Error("IIFE detected!");
    }
    
    // Check for disallowed keywords
    const disallowed = ["eval", "Function", "fetch", "XMLHttpRequest"];
    for (const keyword of disallowed) {
        if (methodString.includes(keyword)) {
            throw new Error(`Disallowed keyword detected: ${keyword}`);
        }
    }
    
    // ... Add more validation steps here ...
    
    return true;
}

function executeMethodInWorker(methodString, externalArgs) {
    return new Promise((resolve, reject) => {
        if (!validateMethodString(methodString)) {
            reject(new Error("Invalid method string provided."));
            return;
        }

        const workerFunction = `
            self.onmessage = function(event) {
                const methodFunction = new Function("resource", "${methodString}");
                const result = methodFunction(event.data.externalArgs);

                if (typeof result === 'string' || typeof result === 'number') {
                    self.postMessage(result);
                } else {
                    self.postMessage('');
                }
            }
        `;

        const blob = new Blob([workerFunction], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);
        const worker = new Worker(blobURL);

        worker.onmessage = function(event) {
            if (typeof event.data === 'string' || typeof event.data === 'number') {
                resolve(event.data);
                worker.terminate();
                URL.revokeObjectURL(blobURL);
            } else {
                resolve("");
                worker.terminate();
                URL.revokeObjectURL(blobURL);
            }
           
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
    for (const key in schema.customParams) {
        const value = schema.customParams[key];
        if (value.startsWith("**methods.") && value.endsWith("**")) {
            const methodInvocation = value.slice(10, -2).split('(');
            const methodName = methodInvocation[0];

            if (schema.methods[methodName]) {
                const newResource = {
                    identifier: resource.identifier,
                    name: resource.name,
                    service: resource.service
                }
				const methodResult = await executeMethodInWorker(schema.methods[methodName], newResource);
                schema.customParams[key] = methodResult;
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



// export const schemaList = [schema]

 const schema = {
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
            "methods": {
                "getShortId": "return resource.identifier.split('-post-')[1];",
                "getBlogId": "const arr = resource.identifier.split('-post-'); const id = arr[0]; return id.startsWith('q-blog-') ? id.substring(7) : id;"
            }
         
        }
    ]
}

