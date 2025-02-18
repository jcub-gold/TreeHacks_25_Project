# Verify
Connor Lee, Jacob Goldberg, Jonas Pao, Kevin Pan TreeHacks 2025 project

https://devpost.com/software/factchex?_gl=1*mf4hk*_gcl_au*MTMyNTM2ODM5Mi4xNzM5NjAyMTM0*_ga*MTY4ODgwOTYzNy4xNzM5NjAyMTM0*_ga_0YHJK3Y10M*MTczOTg0ODE3My41LjEuMTczOTg0ODE4MS4wLjAuMA..

## Inspiration
As young, first-time voters, almost all of our political awareness and understanding comes from our engagement with social media. Although information access is easier than ever, attaining unbiased information has become nearly impossible in today's highly divisive political environment. From charged language that misrepresents reality to outright lies, a solution that could provide an accurate and unbiased assessment of online content could remove this misinformation fog currently clouding social media.

## What it does
Verify is a Chrome web extension that can analyze a tweet with just a click of a button, presenting an unbiased assessment of the post's subject matter, while citing key sources and presenting an accuracy score. Although intended primarily for political awareness, the tool can be used to assess the accuracy of any tweet, from debunking false sports trades to fact-checking history fun facts. We were motivated to add this on X specifically, as the platform only has community notes as a check against misinformation, which is not available on most tweets.

## How we built it
Our team built Verify by building a Chrome-integrated UI with HTML and CSS, and a JavaScript backend that connected to Perplexity's API for accurate searching and tweet language processing. Our team segmented work between front and back-end development based on our personal interests and experience. At a high level, Connor built our front end, learning and implementing key web design principles on the fly. Meanwhile, Jacob built out our back end in JavaScript, ensuring accurate tweet processing and API calls. Jonas handled complexities related to API calls and ensured well-formatted, balanced, and customized prompt responses with Perplexity. Kevin focused on connecting all the pieces, and integrating the back and front end while supporting UI/UX development.

## Challenges we ran into
The biggest challenge we faced was developing the backend, particularly the messaging between service workers and Chrome extensions. To resolve this problem, we all got hands on deck to resolve it and pushed through several hours of debugging line-by-line, learning a ton about threading and multiprocessing.

## Accomplishments that we're proud of
We're incredibly proud that we were able to come up with and implement a tool that we would personally use in our day-to-day lives. As first-time hackers, we loved seeing our work turn from just an idea into a product that we believe can make a genuine impact on misinformation. We're also very satisfied with the technical progress we achieved.

## What we learned
We all gained significant technical experience, specifically improving our ability to develop in a full-stack environment and to integrate API calls to leverage the immense impact of LLMs. We also learned how severe the misinformation gap is on social media while implementing our product. When testing our tweets on popular creators on both sides of the political spectrum and even on history fun fact pages, we realized how many social media users digest misinformation without thinking deeply about whether the information they're reading is verified.

## What's next for Verify
We are all-in on this project idea and its impact. We will expand upon Verify to integrate the product on other social media platforms like Reddit, Instagram, and YouTube. We believe the biggest opportunity will be to analyze and summarize video content on platforms like YouTube, reducing both misinformation and time spent. Ideally, we would also be able to implement Verify on iOS and Android to further expand its reach by integrating it within apps.
