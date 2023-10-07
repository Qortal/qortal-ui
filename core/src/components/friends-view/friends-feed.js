import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import './friends-view'
import { friendsViewStyles } from './friends-view-css';
import { connect } from 'pwa-helpers';
import { store } from '../../store';
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
			console.log({fullUrl})
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

		} catch (error) {
			console.log(error)
		}
	}

	render() {
		console.log('ron')
		return html`
			<div class="container">
				<div id="viewElement" class="container-body" style=${"position: relative"}>
					hi
				

					${this.feed.map((item) => {
						return html`<p>hello</p>`;
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
            display: "",
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