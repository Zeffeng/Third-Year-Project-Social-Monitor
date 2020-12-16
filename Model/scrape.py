import snscrape.modules.twitter as scrape 
import json 
from datetime import datetime, timedelta
import re
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time 

tweets = []
hashtag = '#coronavirus'
fromDate = '2020-07-29'
toDate = '2020-07-30'

def remove_emoji(string):
    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map symbols
                               u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               u"\U00002500-\U00002BEF"  # chinese char
                               u"\U00002702-\U000027B0"
                               u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               u"\U0001f926-\U0001f937"
                               u"\U00010000-\U0010ffff"
                               u"\u2640-\u2642"
                               u"\u2600-\u2B55"
                               u"\u200d"
                               u"\u23cf"
                               u"\u23e9"
                               u"\u231a"
                               u"\ufe0f"  # dingbats
                               u"\u3030"
                               "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', string)

def geoCode(address):
    geolocator = Nominatim(user_agent="3rd year project")
    try:
        return geolocator.geocode(address)
    except GeocoderTimedOut:
        time.sleep(1)
        return geoCode(address)

numDays = 0
while numDays < 75:
    numTweets = 0
    print(fromDate, toDate)
    for i,tweet in enumerate(scrape.TwitterSearchScraper(hashtag + ' since:' + fromDate + ' until:' + toDate).get_items()) :
            if numTweets > 4:
                break
            if tweet.user.location != '' and tweet.lang == 'en':
                processedContent = re.sub(
                    r'http\S+', 
                    '', 
                    #remove_emoji(tweet.content).replace("#", "").replace("@", "").replace("\n", "").replace(":", "")
                    tweet.content.replace("#", "").replace("@", "").replace("\n", "").replace(":", "")
                )
                location = geoCode(tweet.user.location)
                if location is not None:
                    tweets.append({
                        "id": tweet.id,
                        #"content": processedContent.lower(),
                        "content": processedContent,
                        "location": tweet.user.location,
                        "actualLocation": location.raw ,
                        "lang": tweet.lang,
                        "date": tweet.date.strftime("%m/%d/%Y, %H:%M:%S")
                    })
                    numTweets = numTweets + 1
    numDays = numDays + 1
    fromDate = toDate
    toDate = (datetime.strptime(fromDate, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y-%m-%d')

with open('output.txt', 'w', encoding='utf-8') as f:
    f.write(json.dumps(tweets, indent=4, sort_keys=True))