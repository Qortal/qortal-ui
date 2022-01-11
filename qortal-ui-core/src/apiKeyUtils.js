import * as api from 'qortal-ui-crypto'

'use strict'

export const checkApiKey = async (nodeConfig) => {

    let selectedNode = nodeConfig.knownNodes[nodeConfig.node];
    if (selectedNode.enableManagement === false) {
        console.log("Skipping API key check because enableManagement is false");
        return;
    }

    let apiKey = selectedNode.apiKey;

    // Attempt to generate an API key
    const generateUrl = "/admin/apikey/generate";
    let generateRes = await api.request(generateUrl, {
        method: "POST"
    });

    if (generateRes != null && generateRes.error == null && generateRes.length >= 8) {
        console.log("Generated API key");
        apiKey = generateRes;
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

        let apiKeyValid = false;

        while (apiKeyValid === false) {

            let apiKeyPrompt = prompt("Please enter the API key for this node.\n\nIt can be found in a file called 'apikey.txt' in the directory where the core is installed.\n\nAlternatively, click Cancel to use the core with reduced functionality.", "");
            if (apiKeyPrompt === null) {
                // Cancel was pushed - so give up
                return;
            }

            let testResult = await testApiKey(apiKeyPrompt);
            if (testResult === true) {
                console.log("API key prompt test passed");
                apiKeyValid = true;
                apiKey = apiKeyPrompt;
                break;
            }
            else {
                console.log("API key prompt test failed. Re-prompting...");
            }

        }
    }

    // Store API key
    selectedNode.apiKey = apiKey;
    nodeConfig.knownNodes[nodeConfig.node] = selectedNode;
    localStorage.setItem('myQortalNodes', JSON.stringify(nodeConfig.knownNodes));
}

export const testApiKey = async (apiKey) => {
    const testUrl = "/admin/apikey/test?apiKey=" + apiKey;
    let testRes = await api.request(testUrl, {
        method: "GET"
    });
    if (testRes === true) {
        return true;
    }
    return false;
}
