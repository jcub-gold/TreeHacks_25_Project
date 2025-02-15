console.log("📡 Background script loaded!");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Received message:", message); // Debugging log

    if (!message || typeof message !== "object") {
        console.warn("⚠️ Invalid message received:", message);
        return;
    }

    if (message.action === "tweetsExtracted") {
        console.log("📨 Received 'tweetsExtracted' action.");

        // Validate that tweets are present
        if (!Array.isArray(message.tweets) || message.tweets.length === 0) {
            console.warn("⚠️ No valid tweets received.");
            return;
        }

        console.log(`✅ Extracted ${message.tweets.length} tweets.`);
        console.log("🐦 First tweet:", message.firstIndex);

        // Simulate sending tweets to the API for analysis
        console.log("🔄 Sending tweets to API for analysis...");
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response received:", results);

                // Ensure the sender's tab exists before sending a response
                if (sender.tab && sender.tab.id) {
                    console.log(`📤 Sending analysis results to tab ID: ${sender.tab.id}`);
                    chrome.tabs.sendMessage(sender.tab.id, { 
                        action: "analysisResults", 
                        results: results 
                    }, response => {
                        if (chrome.runtime.lastError) {
                            console.error("❌ Error sending message to content script:", chrome.runtime.lastError);
                        } else {
                            console.log("📤 Successfully sent analysis results to content script.");
                        }
                    });
                } else {
                    console.warn("⚠️ Sender tab not available. Could not send response.");
                }
            })
            .catch(error => console.error("❌ API Error:", error));
    }

    if (message.action === "checkConnection") {
        console.log("🔄 Connection check received.");
        sendResponse({ status: "ok" });
    }
});

// Listen for extension button click
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension button clicked");
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
});