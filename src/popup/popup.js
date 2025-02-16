// Add button click handler
document.getElementById('analyzeButton').addEventListener('click', async () => {
    // Reset UI to analyzing state
    setAnalyzingState();
    
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to extract tweets
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
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
    } else if (message.action === "analysisComplete") {
        displayResults(message.results);
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
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    // Calculate truth percentage (inverse of fake probability)
    const truthPercentage = (100 - (results.probability_fake * 100)).toFixed(0);
    
    // Update status and percentage
    const truthStatus = document.getElementById('truthStatus');
    const truthPercent = document.getElementById('truthPercent');
    
    if (truthPercentage >= 70) {
        truthStatus.textContent = 'Likely True';
        truthStatus.style.color = 'hsl(92, 90%, 68%)';
    } else if (truthPercentage >= 30) {
        truthStatus.textContent = 'Uncertain';
        truthStatus.style.color = 'hsl(45, 90%, 68%)';
    } else {
        truthStatus.textContent = 'Likely False';
        truthStatus.style.color = 'hsl(7, 89%, 46%)';
    }
    
    truthPercent.textContent = `${truthPercentage}%`;

    // Update the main bar width and color
    const mainBar = document.querySelector('.main-bar');
    mainBar.style.width = `${truthPercentage}%`;
    mainBar.style.background = truthPercentage >= 70 ? 'hsl(92, 90%, 68%)' : 
                              truthPercentage >= 30 ? 'hsl(45, 90%, 68%)' : 
                              'hsl(7, 89%, 46%)';

    // Update sources
    const mainSources = document.querySelector('.main-sources');
    mainSources.innerHTML = ''; // Clear existing sources
    
    results.sources.forEach((source, index) => {
        const link = document.createElement('a');
        link.href = source;
        link.className = 'source-link';
        link.textContent = `🔗 Source ${index + 1}: ${source}`;
        mainSources.appendChild(link);
    });

    // Add click handler for expand button
    document.querySelector('.expand-btn').addEventListener('click', () => {
        window.location.href = 'expand.html';
    });
}

// Function to display error in the popup
function displayError(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <p>Error: ${message}</p>
    `;
}

function setAnalyzingState() {
    document.getElementById('truthStatus').textContent = 'Analyzing...';
    document.getElementById('truthPercent').textContent = '';
    document.getElementById('sourceLinks').innerHTML = '';
    
    // Reset the progress bar
    const mainBar = document.getElementById('mainBar');
    mainBar.style.animation = 'none';
    mainBar.offsetHeight; // Trigger reflow
    mainBar.style.width = '0%';
    mainBar.style.background = 'hsl(7, 89%, 46%)';
}