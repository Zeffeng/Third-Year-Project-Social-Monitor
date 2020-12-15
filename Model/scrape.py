import snscrape.modules.twitter as scrape 
import json 
from datetime import datetime, timedelta
import re
from geopy.geocoders import Nominatim

tweets = []
hashtag = '#coronavirus'
fromDate = '2020-03-01'
toDate = '2020-03-02'

geolocator = Nominatim(user_agent="3rd year project")

numDays = 0
while numDays < 256:
    numTweets = 0
    print(fromDate, toDate)
    for i,tweet in enumerate(scrape.TwitterSearchScraper(hashtag + ' since:' + fromDate + ' until:' + toDate).get_items()) :
            if numTweets > 5:
                break
            if tweet.user.location != '' and tweet.lang == 'en':
                processedContent = re.sub(
                    r'http\S+', 
                    '', 
                    tweet.content.replace("#", "").replace("@", "").replace("\n", "")
                )
                location = geolocator.geocode(tweet.user.location)
                if location is not None:
                    tweets.append({
                        "id": tweet.id,
                        "content": processedContent,
                        "location": tweet.user.location,
                        "actualLocation": location.raw,
                        "lang": tweet.lang,
                        "date": tweet.date.strftime("%m/%d/%Y, %H:%M:%S")
                    })
                    numTweets = numTweets + 1
    numDays = numDays + 1
    fromDate = toDate
    toDate = (datetime.strptime(fromDate, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y-%m-%d')


with open('output.txt', 'w', encoding='utf-8') as f:
    for item in tweets:
        f.write("%s\n" % item)

# i = open("output.txt", "r", encoding='utf-8')
# print(i.read())