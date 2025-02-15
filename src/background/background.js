console.log("📡 Background script loaded!");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log(`📨 Received ${message.tweets.length} tweets`);

        // Validate that tweets are present
        if (!Array.isArray(message.tweets) || message.tweets.length === 0) {
            console.warn("⚠️ No valid tweets received.");
            return;
        }

        // Log the first tweet: GETTING THE FIRST ONE IS NICE BUT IF IT IS A TWEET REPLY, 
        // IT SHOULD EXTRACT THE SECOND TWEET AND IF POSSIBLE ADD CONTEXT FROM THE FIRST ONE
        console.log("🐦 First tweet:", message.tweets[0]);

        // Simulate sending tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);
            });
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
    return [];
}

// Listen for extension button click
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension button clicked");
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
});