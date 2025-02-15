# TreeHacks_25_Project
Connor Lee, Jacob Goldberg, Jonas Pao, Kevin Pan TreeHacks 2025 project

# This is what each function does:
icon - images and icons
src - all of our code
    background
        bockground.js:
            this should run our API call (thread) and we need to pipe between our x.js file and this background file
        index.js:
            idk jacob made
    scripts:
        x.js:
            reads in tweets from x
manifest.json - this outlines all permissions and pipelines for the extension
popup.html - this is the UI/UX for the extension

TODO:

1. API call and getting that formatted — perlexity etc
2. How we want to display the data we get from Perplexity/AI
3. Error handling
4. Making sure the piplines work (very sure that x.js -> background.js works, but not sure background.js->API->background.js->x.js->consol really works, kind of waiting for API key to test this)
5. Make sure we have some UI when we click on the extension.


Current data pipline:
x.js (if we see a new tweet) -> send tweet to... background.js -> API-> background.js... send back the API response to -> x.js -> print to screen

