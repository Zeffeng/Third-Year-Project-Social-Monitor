# Third Year Project - Social Monitor

### Aim

The end goal of the project is to have a website to analyse the content of social media posts (tweeest). A subject will be chosen for the tweets (hashtag or search term). The tweets will be grouped based on time and location, then natural language processing methods will be performed, which allows us to:

- Track how the language of the tweets change across location and time using sentiment analysis
- Identify useful patterns by analysing the tweets for key elements such as topics, people, dates, locations, companies

The website will take the form of a dashboard containing a world map which will visualise the sentiment of the tweets

### Objectives/Todo

The project will be split up into three main objectives to facilitate smoother development: 

- Acquire data - Done
  - Tweets need to be scraped somehow: Best case scenario take a single hashtag and get every tweet from start to now
  - Data pre-processing
- Create site
  - React setup, etc..
  - World map: Find a JS library with an interactable world map, zoomable, overlay data, colours to represent +/-
  - Timeline: Slider to change date? map reacts to this change
- Process Data 
  - Sentiment analysis (Currently using VADER, and investigating BERT, and clustering methods)
  - Entity Recognition

### Tech

* [React] - Main JS framework for site
* [AMCharts] - Charting package used for world map
* [Snscrape] - Used to scrape tweets ids for specific hashtags
* [Social Media Mining Tool (SMMT)] - Used to hydrate tweet ids
* [spaCy] - Used to Name Entity Recognition


