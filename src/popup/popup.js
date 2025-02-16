// Wait for DOM to be fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add analyze button click handler
    const analyzeButton = document.getElementById('analyzeButton');
    if (analyzeButton) {
        analyzeButton.addEventListener('click', async () => {
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script to extract tweets
            chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
        });
    }
});

// When popup loads, check for stored results
document.addEventListener('DOMContentLoaded', () => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        // Request the latest results from background script
        chrome.runtime.sendMessage({ 
            action: "tweetsExtracted",
            tabId: currentTab.id 
        });
    });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in popup:", message); // Debug log
    
    if (message.action === 'showLoading') {
        console.log("📩 Received showLoading message in popup");
        showLoading();
    } else if (message.action === 'displayResults') {
        console.log("📩 Results received in popup:", message.results);
        displayResults(message.results);
    } else if (message.action === 'displayError') {
        console.log("📩 Error received in popup:", message.message);
        displayError(message.message);
    } else if (message.action === "analysisComplete" && message.results) {
        console.log("Sources received:", message.results.sources);
        
        // Get the sources container
        const sourcesContainer = document.querySelector('.main-sources');
        sourcesContainer.innerHTML = ''; // Clear existing content
        
        // Display each source as a formatted link
        message.results.sources.forEach((source, index) => {
            const link = document.createElement('a');
            link.href = source;
            link.className = 'source-link';
            
            // Try to extract and display just the domain name
            try {
                const url = new URL(source);
                const domain = url.hostname.replace('www.', '');
                link.textContent = `🔗 Source ${index + 1}: ${domain}`;
            } catch (e) {
                // If URL parsing fails, show the full source
                link.textContent = `🔗 Source ${index + 1}: ${source}`;
            }
            
            link.style.cssText = `
                display: block;
                color: #ffffff;
                text-decoration: underline;
                padding: 8px;
                margin: 5px 0;
                background: #2a2a2a;
                border-radius: 5px;
            `;
            
            sourcesContainer.appendChild(link);
        });
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
        link.target = "_blank";
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

function updateSources(sources) {
    console.log("Updating sources in popup:", sources); // Debug log
    
    const mainSources = document.querySelector('.main-sources');
    if (!mainSources) {
        console.error("Could not find .main-sources element");
        return;
    }
    
    mainSources.innerHTML = ''; // Clear any existing sources
    
    // Add up to 3 sources
    if (Array.isArray(sources)) {
        sources.slice(0, 3).forEach((source, index) => {
            const link = document.createElement('a');
            link.href = source;
            link.className = 'source-link';
            link.textContent = `🔗 Source ${index + 1}: ${source}`;
            mainSources.appendChild(link);
        });
    } else {
        console.error("Sources is not an array:", sources);
    }
}

// As soon as popup.html loads, get and display the stored results
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['factCheckResults', 'reliabilityPercentage', 'summary'], (data) => {
        if (data.factCheckResults && data.reliabilityPercentage) {
            console.log("Retrieved stored results:", data.factCheckResults);
            
            const truthPercent = document.querySelector('.truth-percent');
            const truthStatus = document.querySelector('.truth-status');
            const gaugeFill = document.querySelector('.gauge-fill');
            const percentage = data.reliabilityPercentage;
            
            // Calculate the angle based on percentage
            const finalAngle = (percentage / 100) * 360;
            
            // Determine the color based on percentage
            const gaugeColor = percentage >= 70 ? 'hsl(92, 90%, 68%)' : 
                             percentage >= 30 ? 'hsl(45, 90%, 68%)' : 
                             'hsl(7, 89%, 46%)';
            
            // Set both custom properties
            gaugeFill.style.setProperty('--final-angle', `${finalAngle}deg`);
            gaugeFill.style.setProperty('--gauge-color', gaugeColor);

            // Immediately set percentage and status
            if (truthPercent) {
                truthPercent.textContent = `${percentage}%`;
            }

            if (truthStatus) {
                if (percentage >= 70) {
                    truthStatus.textContent = 'Likely True';
                } else if (percentage >= 30) {
                    truthStatus.textContent = 'Uncertain';
                } else {
                    truthStatus.textContent = 'Likely False';
                }
                truthStatus.style.color = gaugeColor;
            }

            // Display sources
            const sourcesContainer = document.querySelector('.main-sources');
            sourcesContainer.innerHTML = '';
            
            data.factCheckResults.sources.forEach((source, index) => {
                const link = document.createElement('a');
                link.href = source;
                link.className = 'source-link';
                link.target = "_blank";
                
                try {
                    const url = new URL(source);
                    const domain = url.hostname.replace('www.', '');
                    link.textContent = `🔗 Source ${index + 1}: ${domain}`;
                } catch (e) {
                    link.textContent = `🔗 Source ${index + 1}: ${source}`;
                }
                
                link.style.cssText = `
                    display: block;
                    color: #ffffff;
                    text-decoration: underline;
                    padding: 8px;
                    margin: 5px 0;
                    background: #2a2a2a;
                    border-radius: 5px;
                `;
                
                sourcesContainer.appendChild(link);
            });

            // Add summary display
            const summarySection = document.querySelector('.summary-section');
            if (summarySection && data.summary) {
                summarySection.textContent = data.summary;
            }
        } else {
            console.error("No stored results found");
        }
    });
});