console.log("📡 Background script loaded!");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log("📨 Received tweets:", message.tweets);

        // Validate that tweets are present
        if (!Array.isArray(message.tweets) || message.tweets.length === 0) {
            console.warn("⚠️ No valid tweets received.");
            return;
        }

        // Send tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);

                // Ensure the sender's tab exists before sending a response
                if (sender.tab && sender.tab.id) {
                    chrome.tabs.sendMessage(sender.tab.id, { 
                        action: "analysisResults", 
                        results: results 
                    }, response => {
                        if (chrome.runtime.lastError) {
                            console.error("❌ Error sending message to content script:", chrome.runtime.lastError);
                        } else {
                            console.log("📤 Sent analysis results to content script.");
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

    return true; // Keeps the messaging channel open for async responses
});

// Function to call the fact-checking API with a retry mechanism
async function analyzeTweets(tweets, retries = 3) {
    const apiURL = "https://your-api.com/analyze";

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let response = await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tweets: tweets }) // Send tweets in request
            });

            if (!response.ok) throw new Error(`API request failed: ${response.status}`);

            let data = await response.json();

            // Validate the API response format
            if (!Array.isArray(data) || !data.every(item => item.text && typeof item.probability === "number")) {
                throw new Error("Invalid API response format.");
            }

            return data; // Expected response: [{ text: "tweet1", probability: 85 }, { text: "tweet2", probability: 30 }]
        } catch (error) {
            console.error(`❌ API Error (Attempt ${attempt} of ${retries}):`, error);

            if (attempt === retries) {
                console.error("🚨 API request failed after multiple attempts.");
                return []; // Return empty array on failure
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}
