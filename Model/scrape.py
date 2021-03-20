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

tweets = []
hashtag = sys.argv[1]
outputFileName = sys.argv[2]
fromDate = '2020-01-01'
toDate = '2020-01-02'

daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

geolocator = Nominatim(user_agent="3rd year project")
geolocatorRateL = RateLimiter(geolocator.geocode, min_delay_seconds=5)
def geoCode(address):
    try:
        return geolocatorRateL(address)
    except GeocoderTimedOut:
        time.sleep(1)
        return geoCode(address)

auth = tweepy.AppAuthHandler("MAHDLIR9hqfBrkoLWWlVxHQ6V","M3bU5oKKOK1TTfzq69DYX2Ah8LSBZLj5lZeQntkKPeGFqghjPn")
api = tweepy.API(auth, wait_on_rate_limit=True)
curMonth = 1
maxTweetsPerDay = 40
while curMonth < 13:
    numDays = 0
    while numDays < daysInMonth[curMonth]:
        numTweets = 0
        print(fromDate, toDate)
        for i,tweet in enumerate(scrape.TwitterSearchScraper('#' + hashtag + ' since:' + fromDate + ' until:' + toDate).get_items()) :
                if numTweets > maxTweetsPerDay:
                    break
                user = api.get_user(tweet.username)
                if user is not None and hasattr(user, 'location') and hasattr(tweet, 'content') and detect(tweet.content) == 'en':
                    processedContent = re.sub(
                        r'http\S+', 
                        '', 
                        tweet.content.replace("#", "").replace("@", "").replace("\n", "").replace(":", "")
                    )
                    location = geoCode(user.location)
                    if location is not None:
                        country = location.address.split(", ")[-1]
                        countryCode = pycountry.countries.get(name = country)
                        if countryCode is not None:
                            tweets.append({
                                "id": tweet.id,
                                "content": processedContent,
                                "lat": location.latitude,
                                "lon": location.longitude,
                                "alpha2": countryCode.alpha_2,
                                "date": tweet.date.strftime("%m/%d/%Y"),
                                "label": None
                            })
                            numTweets += 1
        numDays = numDays + 1
        fromDate = toDate
        toDate = (datetime.strptime(fromDate, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y-%m-%d')
    with open(outputFileName + '.txt', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tweets, indent=4, sort_keys=True))
    curMonth += 1
    if curMonth < 10:
        fromDate = '2020-0' + str(curMonth) + '-01'
        toDate = '2020-0' + str(curMonth) + '-02'
    else:
        fromDate = '2020-' + str(curMonth) + '-01'
        toDate = '2020-' + str(curMonth) + '-02'
