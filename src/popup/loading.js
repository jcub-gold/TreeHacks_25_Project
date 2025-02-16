// Listen for analysis results
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analysisComplete") {
        // Redirect to main results page with data
        window.location.href = 'popup.html';
    }
}); 