// Listen for analysis results
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analysisComplete" && message.results) {
        // Calculate reliability percentage
        const reliabilityPercentage = (100 - (message.results.probability_fake * 100)).toFixed(0);
        
        // Store both the results, reliability, and summary
        chrome.storage.local.set({
            'factCheckResults': message.results,
            'reliabilityPercentage': reliabilityPercentage,
            'summary': message.results.summary
        }, () => {
            // After storing results, redirect to popup.html
            window.location.href = 'popup.html';
        });
    }
}); 