document.getElementById('extractTweets').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractTweets' });
    });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showLoading') {
        console.log("📩 Received showLoading message in popup");
        showLoading();
    } else if (message.action === 'displayResults') {
        console.log("📩 Results received in popup:", message.results);
        displayResults(message.results);
    } else if (message.action === 'displayError') {
        console.log("📩 Error received in popup:", message.message);
        displayError(message.message);
    }
});

// Function to show loading screen in the popup
function showLoading() {
    document.getElementById('verifyContainer').classList.add('hidden');
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = `
        <p>Loading...</p>
    `;
}

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

// Function to display error in the popup
function displayError(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <p>Error: ${message}</p>
    `;
}