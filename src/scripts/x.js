console.log("✅ Content script loaded!");

// Function to extract tweets from the Twitter page
function extractTweets() {
    let tweets = []; // Array to store extracted tweet texts

    // Select all tweet containers (inside <article> elements)
    document.querySelectorAll("article").forEach(tweet => {
        let tweetText = tweet.querySelector("div[lang]")?.innerText; // Extract tweet text
        if (tweetText) {
            tweets.push(tweetText);
        }
    });

    if (tweets.length > 0) {
        console.log("🐦 Extracted Tweets:", tweets); // Debugging log
        chrome.runtime.sendMessage({ action: "tweetsExtracted", tweets: tweets }); // Send tweets to background.js
    } else {
        console.log("⚠️ No tweets found. Is the page loaded?");
    }
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
