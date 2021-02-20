import snscrape.modules.twitter as scrape 
import json 
from datetime import datetime, timedelta
import re
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geopy.extra.rate_limiter import RateLimiter
import time 
import tweepy
from langdetect import detect
import pycountry
import sys

tweets = []
hashtag = sys.argv[1]
outputFileName = sys.argv[2]
fromDate = '2020-01-01'
toDate = '2020-01-02'

daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
# def remove_emoji(string):
#     emoji_pattern = re.compile("["
#                                u"\U0001F600-\U0001F64F"  # emoticons
#                                u"\U0001F300-\U0001F5FF"  # symbols & pictographs
#                                u"\U0001F680-\U0001F6FF"  # transport & map symbols
#                                u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
#                                u"\U00002500-\U00002BEF"  # chinese char
#                                u"\U00002702-\U000027B0"
#                                u"\U00002702-\U000027B0"
#                                u"\U000024C2-\U0001F251"
#                                u"\U0001f926-\U0001f937"
#                                u"\U00010000-\U0010ffff"
#                                u"\u2640-\u2642"
#                                u"\u2600-\u2B55"
#                                u"\u200d"
#                                u"\u23cf"
#                                u"\u23e9"
#                                u"\u231a"
#                                u"\ufe0f"  # dingbats
#                                u"\u3030"
#                                "]+", flags=re.UNICODE)
#     return emoji_pattern.sub(r'', string)

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
while curMonth < 13:
    numDays = 0
    while numDays < daysInMonth[curMonth]:
        numTweets = 0
        print(fromDate, toDate)
        for i,tweet in enumerate(scrape.TwitterSearchScraper('#' + hashtag + ' since:' + fromDate + ' until:' + toDate).get_items()) :
                if numTweets > 15:
                    break
                user = api.get_user(tweet.username)
                if user is not None and hasattr(user, 'location') and detect(tweet.content) == 'en':
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
                            numTweets = numTweets + 1
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
