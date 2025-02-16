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

        // Simulate sending tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);
                // Send results to popup
                chrome.runtime.sendMessage({
                    action: "analysisComplete",
                    results: results
                });
                sendResponse({ status: "success", results: results });
            })
            .catch(error => {
                console.error("❌ API Error:", error);
                sendResponse({ status: "error", message: error.message });
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
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        const simulated_response = {
            probability_fake: Math.random().toFixed(2), // Generates a random value between 0 and 1
            sources: [
                "https://www.fakenewsnetwork.com/article123",
                "https://www.suspicioussource.net/story456",
                "https://www.unreliablesite.com/post789"
            ],
            summary: "This is a summary of the tweets Aas;ldkfjasd;lkfja;lsdkfgjba;lidofhbjoipawejklfdszopivj;eaklwfopi;kjslaew;rgiolsfadhjkia;hlke ak;lesdfj;alksdjfgh;aoijweghrfsiogljhkawerfgdilkjanfd;ak e;lkjew ;OIAKLJDSFGA;LKFGJH;ALHJF;AOIJDF;AILKSDFJ"
        };
        return simulated_response;
    }

// Listen for extension button click
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension button clicked");
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
});