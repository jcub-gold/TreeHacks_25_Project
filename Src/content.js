function extractTweets() {
    let tweets = [];
    document.querySelectorAll('article').forEach(tweet => {
        let tweetText = tweet.querySelector('div[lang]')?.innerText;
        if (tweetText) {
            tweets.push(tweetText);
        }
    });

    if (tweets.length > 0) {
        console.log("Extracted Tweets:", tweets);
        chrome.runtime.sendMessage({ action: "tweetsExtracted", tweets: tweets });
    }
}

// Run the extraction when the page loads
extractTweets();

// Listen for dynamic changes (for infinite scrolling)
const observer = new MutationObserver(() => extractTweets());
observer.observe(document.body, { childList: true, subtree: true });
