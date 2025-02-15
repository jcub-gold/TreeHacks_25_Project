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
        chrome.runtime.sendMessage({ action: "tweetsExtracted", tweets: tweets.map(t => t.text) }, response => {
            if (chrome.runtime.lastError) {
                console.error("⚠️ Message send failed:", chrome.runtime.lastError);
            } else {
                console.log("📨 Sent tweets to background.js, awaiting API response...");
            }
        });
    } else {
        console.log("⚠️ No tweets found. Is the page loaded?");
    }
}

// Listen for API response from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analysisResults") {
        console.log("📢 API Response received:", message.results);
        displayResultsOnTweets(message.results);
    }
});


// Function to display API results on Twitter UI
function displayResultsOnTweets(results) {
    let tweetElements = document.querySelectorAll("article");

    results.forEach((result, index) => {
        let tweetElement = tweetElements[index];
        if (tweetElement) {
            let label = document.createElement("div");
            label.innerText = `🔎 Fake News Probability: ${result.probability}%`;
            label.style.color = result.probability > 50 ? "red" : "green";
            label.style.fontSize = "14px";
            label.style.fontWeight = "bold";
            label.style.marginTop = "5px";

            // Append label if not already added
            if (!tweetElement.querySelector(".factcheck-label")) {
                label.classList.add("factcheck-label");
                tweetElement.appendChild(label);
            }
        }
    });
}

// Run extraction when the page loads
extractTweets();

// Observe changes on the page (for infinite scrolling and dynamically loaded tweets)
const observer = new MutationObserver(() => {
    console.log("🔄 Page updated, checking for new tweets...");
    extractTweets();
});

// Start observing the page for new tweets
observer.observe(document.body, { childList: true, subtree: true });

console.log("👀 MutationObserver is active, watching for tweet updates.");