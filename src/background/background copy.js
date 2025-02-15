console.log("📡 Background script loaded!");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log("📨 Received tweets:", message.tweets);

        // Send tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);

                // Send analyzed results back to content script
                chrome.tabs.sendMessage(sender.tab.id, { 
                    action: "analysisResults", 
                    results: results 
                });
            })
            .catch(error => console.error("❌ API Error:", error));
    }

    if (message.action === "checkConnection") {
        console.log("🔄 Connection check received.");
        sendResponse({ status: "ok" });
    }

    return true; // Keeps the messaging channel open for async responses
});

// Function to call the fact-checking API
async function analyzeTweets(tweets) {
    try {
        let response = await fetch("https://your-api.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tweets: tweets }) // Send tweets in request
        });

        if (!response.ok) throw new Error(`API request failed: ${response.status}`);

        let data = await response.json();
        return data; // Expected response: [{ text: "tweet1", probability: 85 }, { text: "tweet2", probability: 30 }]
    } catch (error) {
        console.error("API Error:", error);
        return []; // Return empty array on failure
    }
}
