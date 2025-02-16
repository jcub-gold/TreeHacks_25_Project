console.log("📡 Background script loaded!");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log(`📨 Received ${message.tweets.length} tweets`);

        // Validate that tweets are present
        if (!Array.isArray(message.tweets) || message.tweets.length === 0) {
            console.warn("⚠️ No valid tweets received.");
            sendResponse({ status: "error", message: "No valid tweets received." });
            return;
        }

        // Log the first tweet
        console.log("🐦 First tweet:", message.tweets[0]);

        // Notify popup to display loading screen
        console.log("🔄 Notifying popup to display loading screen...");
        chrome.runtime.sendMessage({ action: "showLoading" });

        // Simulate sending tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);
                sendResponse({ status: "success", results: results });

                // Notify popup to display results
                console.log("🔄 Notifying popup to display results...");
                chrome.runtime.sendMessage({ action: "displayResults", results: results });
            })
            .catch(error => {
                console.error("❌ API Error:", error);
                sendResponse({ status: "error", message: error.message });

                // Notify popup to display error
                console.log("🔄 Notifying popup to display error...");
                chrome.runtime.sendMessage({ action: "displayError", message: error.message });
            });

        return true; // Keeps the messaging channel open for async responses
    }

    if (message.action === "checkConnection") {
        console.log("🔄 Connection check received.");
        sendResponse({ status: "ok" });
    }

    return true; // Keeps the messaging channel open for async responses
});

// Function to call the fact-checking API with a retry mechanism
async function analyzeTweets(tweets, retries = 3) {
    console.log("🔄 Simulating sending tweets to API for analysis...");

    // Simulate a delay of 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const simulated_response = {
        probability_fake: Math.random().toFixed(2), // Generates a random value between 0 and 1
        sources: [
            "https://www.fakenewsnetwork.com/article123",
            "https://www.suspicioussource.net/story456",
            "https://www.unreliablesite.com/post789"
        ]
    };
    return simulated_response;
}

// Listen for extension button click
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension button clicked");
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
});