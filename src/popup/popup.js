document.getElementById('extractTweets').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractTweets' });
    });
});

// Listen for results from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'displayResults') {
        console.log("📩 Results received in popup:", message.results);
        displayResults(message.results);
    }
});

// Function to display results in the popup
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <p>Probability Fake: ${results.probability_fake}</p>
        <p>Sources:</p>
        <ul>
            ${results.sources.map(source => `<li><a href="${source}" target="_blank">${source}</a></li>`).join('')}
        </ul>
    `;
}