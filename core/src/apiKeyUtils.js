import * as api from 'qortal-ui-crypto'
import mykey from './functional-components/mykey-page.js'

'use strict'

export const checkApiKey = async (nodeConfig) => {

    let selectedNode = nodeConfig.knownNodes[nodeConfig.node];
    let apiKey = selectedNode.apiKey;

    // Attempt to generate an API key
    const generateUrl = "/admin/apikey/generate";
    let generateRes = await api.request(generateUrl, {
        method: "POST"
    });

    if (generateRes != null && generateRes.error == null && generateRes.length >= 8) {
        console.log("Generated API key");
        apiKey = generateRes;

        // Store the generated API key
        selectedNode.apiKey = apiKey;
        nodeConfig.knownNodes[nodeConfig.node] = selectedNode;
        localStorage.setItem('myQortalNodes', JSON.stringify(nodeConfig.knownNodes));
    }
    else {
        console.log("Unable to generate API key");
    }

    // Now test the API key
    let testResult = await testApiKey(apiKey);
    if (testResult === true) {
        console.log("API key test passed");
    }
    else {
        console.log("API key test failed");
        mykey.show();
        this.dispatchEvent(
			new CustomEvent('disable-tour', {
			  bubbles: true,
			  composed: true
			}),
		  );
    }
}

export const testApiKey = async (apiKey) => {
    const testUrl = "/admin/apikey/test?apiKey=" + apiKey;
    let testRes = await api.request(testUrl, {
        method: "GET"
    });
    return testRes === true;

}
