chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log("Received tweets:", message.tweets);
        // You can process the tweets here (send to Perplexity/Rox AI)
    }
});
