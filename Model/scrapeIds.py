import snscrape.modules.twitter as scrape 
import json 
from datetime import datetime, timedelta
import re
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geopy.extra.rate_limiter import RateLimiter
import time 
import tweepy
from langdetect import detect, lang_detect_exception
import pycountry
import sys

# Run this after scraping ids to hydrate tweets
# python get_metadata.py -i clean-dataset-filtered.tsv -o "file-name" -k api_keys.json

tweets = []
hashtag = sys.argv[1]
outputFileName = sys.argv[2]
fromDate = '2020-01-01'
toDate = '2020-01-02'

daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

curMonth = 1
maxTweetsPerDay = 30
while curMonth < 13:
    numDays = 0
    while numDays < daysInMonth[curMonth]:
        numTweets = 0
        print(fromDate, toDate)
        for i,tweet in enumerate(scrape.TwitterSearchScraper('#' + hashtag + ' since:' + fromDate + ' until:' + toDate + " lang:en").get_items()):
            if numTweets > maxTweetsPerDay:
                break
            if hasattr(tweet, 'content'):
                contentNoLinks = re.sub(
                    r'http\S+', 
                    '', 
                    tweet.content
                )
                if not contentNoLinks != "" or not contentNoLinks.isspace():
                    tweets.append(tweet.id)
                    numTweets += 1
        numDays += 1
        fromDate = toDate
        toDate = (datetime.strptime(fromDate, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y-%m-%d')
    with open("Data/" + outputFileName + '.txt', 'w', encoding='utf-8') as f:
        for item in tweets:
            f.write(str(item) + "\n")
    curMonth += 1
    if curMonth < 10:
        fromDate = '2020-0' + str(curMonth) + '-01'
        toDate = '2020-0' + str(curMonth) + '-02'
    else:
        fromDate = '2020-' + str(curMonth) + '-01'
        toDate = '2020-' + str(curMonth) + '-02'
