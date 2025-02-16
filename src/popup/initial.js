document.getElementById('startButton').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // First, show loading page
    window.location.href = 'loading.html';
    
    // Send message to content script to start extraction
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
}); 