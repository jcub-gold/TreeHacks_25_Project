console.log("✅ Content script loaded!");

// Function to extract tweets from the Twitter page
function extractTweets() {
    let tweets = []; // Array to store extracted tweet texts
    let tweetElements = document.querySelectorAll("article");

    tweetElements.forEach(tweet => {
        let tweetText = tweet.querySelector("div[lang]")?.innerText; // Extract tweet text
        if (tweetText) {
            tweets.push({ text: tweetText, element: tweet });
        }
    });

    if (tweets.length > 0) {
        console.log("🐦 Extracted Tweets:", tweets.map(t => t.text)); // Debugging log

        // Send tweets to background.js
        console.log("📨 Sending tweets to background.js...");
        chrome.runtime.sendMessage({ 
            action: "tweetsExtracted", 
            tweets: tweets.map(t => t.text),
            firstIndex: tweets[0].text // Send the first tweet text
        }, response => {
            if (chrome.runtime.lastError) {
                console.error("⚠️ Message send failed:", chrome.runtime.lastError);
            } else {
                console.log("📨 Sent tweets to background.js, awaiting API response...");
                console.log("📩 Response from background.js:", response);
            }
        });
    } else {
        console.log("⚠️ No tweets found. Is the page loaded?");
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractTweets") {
        console.log("🔍 Extracting tweets...");
        extractTweets();
    }
});