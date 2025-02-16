console.log("📡 Background script loaded!");
const API_KEY = '';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "tweetsExtracted") {
        console.log(`📨 Received ${message.tweets.length} tweets`);

        // Validate that tweets are present
        if (!Array.isArray(message.tweets) || message.tweets.length === 0) {
            console.warn("⚠️ No valid tweets received.");
            sendResponse({ status: "error", message: "No valid tweets received." });
            return;
        }

        // Log the first tweet
        console.log("🐦 First tweet:", message.tweets[0]);

        // Simulate sending tweets to the API for analysis
        analyzeTweets(message.tweets)
            .then(results => {
                console.log("✅ API Response:", results);
                // Send results to popup
                chrome.runtime.sendMessage({
                    action: "analysisComplete",
                    results: results
                });
                sendResponse({ status: "success", results: results });
            })
            .catch(error => {
                console.error("❌ API Error:", error);
                sendResponse({ status: "error", message: error.message });
            });

        return true; // Keeps the messaging channel open for async responses
    }

    if (message.action === "checkConnection") {
        console.log("🔄 Connection check received.");
        sendResponse({ status: "ok" });
    }

    return true; // Keeps the messaging channel open for async responses
});

// Function to call the fact-checking API with a retry mechanism
async function analyzeTweets(tweets) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    {
                        role: "system",
                        content: "Analyze the following tweet for misinformation. Respond with a JSON object containing exactly three fields: 1) probability_fake as a number between 0.00 and 1.00 with 2 decimal places (where 1.00 means 100% likely misinformation and 0.00 means 0% likely misinformation) make sure you have 2 siginficant digits and try to not always give the second digit as 0, and look at it with a critical eye, being as true to the sources you can find on it 2) sources as an array of strings containing full URLs to reputable sources related to the topic make sure the URL is fully formed and accurate, and 3) summary as a string containing a brief summary of the tweet content and the reason behind the misinformation score. Do not include any markdown formatting, code blocks, or the word 'json' - just return the raw JSON object."},
                    {
                        role: "user",
                        content: tweets[0]
                    }
                ],
                max_tokens: 500,
                temperature: 0.0,
                top_p: 0.9,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 1,
                search_domain_filter: ["-x.com", "-twitter.com", "-facebook.com", "-instagram.com", "-reddit.com"]
            })
        };

        const response = await fetch('https://api.perplexity.ai/chat/completions', options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Raw API response:", data); // Log the raw response

        // Parse the content from the response
        let content;
        try {
            // Remove any markdown code block syntax that might be present
            const rawContent = data.choices[0].message.content.trim()
                .replace(/```json\n?/g, '')  // Remove opening code block
                .replace(/```\n?/g, '')      // Remove closing code block
                .trim();
            console.log("Response content:", rawContent); // Log the content before parsing
            content = JSON.parse(rawContent);
        } catch (e) {
            console.error("Failed to parse API response:", e);
            console.log("Unparseable content:", data.choices[0].message.content); // Log the unparseable content
            content = {
                probability_fake: 0.50, // Default to uncertain (50%) with 2 decimal places
                sources: [],
                summary: ""
            };
        }

        // Extract relevant information and validate URLs
        const analysis = {
            probability_fake: typeof content.probability_fake === 'number' ? 
                Number(Math.max(0, Math.min(1, content.probability_fake)).toFixed(2)) : 0.50, // Clamp between 0 and 1 with 2 decimal places
            sources: Array.isArray(content.sources) ? content.sources.filter(url => {
                try {
                    new URL(url);
                    return true;
                } catch {
                    return false;
                }
            }) : [],
            summary: content.summary || ""
        };
        
        console.log("Final analysis:", analysis); // Log the final analysis
        return analysis;

    } catch (error) {
        console.error("Error in analyzeTweets:", error);
        return { 
            error: error.message,
            probability_fake: 0.50, // Default to uncertain (50%) with 2 decimal places
            sources: [],
            summary: ""
        };
    }
}

// Listen for extension button click
chrome.action.onClicked.addListener((tab) => {
    console.log("🔘 Extension button clicked");
    chrome.tabs.sendMessage(tab.id, { action: "extractTweets" });
});