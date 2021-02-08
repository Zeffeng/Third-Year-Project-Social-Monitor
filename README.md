# Third Year Project - Social Monitor

### Aim

The end goal of the project is to have a website to analyse the content of social media posts (just twitter for now). A subject will be chosen for the tweets (hashtag or search term). The tweets will be grouped based on time and location, then natural language processing will be performed, which allows us to:

- Track how the language of the tweets change and whether they are positive or negative using sentiment analysis
- Identify useful patterns by analysing the tweets for key elements such as topics, people, dates, locations, companies

### Objectives/Todo

The project will be split up into three main objectives to facilitate smoother development: 

- Acquire data
  - Tweets need to be scraped somehow: Best case scenario take a single hashtag and get every tweet from start to now
  - Format the data: Create data structure and types, possibly mock some data to allow site development
- Create site
  - React setup, etc..
  - World map: Find a JS library with an interactable world map, zoomable, overlay data, colours to represent +/-
  - Timeline: Slider to change date? map reacts to this change
- Process Data 
  - Sentiment analysis, NER

### Tech

* [React] - Main JS framework for site
* [AMCharts] - Charting package used for world map



