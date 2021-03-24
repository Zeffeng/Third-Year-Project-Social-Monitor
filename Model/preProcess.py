import json
import re
import datetime
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from geopy.extra.rate_limiter import RateLimiter
import time
import pycountry
import sys

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

geolocator = Nominatim(user_agent="3rd year project")
geolocatorRateL = RateLimiter(geolocator.geocode, min_delay_seconds=1)
def geoCode(address):
    try:
        return geolocatorRateL(address, language="en")
    except GeocoderTimedOut:
        return geoCode(address)

def sort(tweets):
    months = [[],[],[],[],[],[],[],[],[],[],[],[],[]]
    for tweet in tweets:
        month = int(tweet["date"].split("-")[1])
        if len(months[month]) == 0:
            months[month].append(tweet)
        else:
            inserted = False
            whereToInsert = [9999999999, 9999999999]
            day = int(tweet["date"].split("-")[2])
            for i in range(len(months[month])):
                difference = int(months[month][i]["date"].split("-")[2]) - day
                if difference == 1 or difference == 0:
                    months[month].insert(i, tweet)
                    inserted = True
                    break;
                elif difference > 0 and difference < whereToInsert[1]:
                    whereToInsert[0] = i;
                    whereToInsert[1] = difference
            if not inserted:
                months[month].insert(whereToInsert[0], tweet)

    sort = []
    for month in months:
        sort = [*sort, *month]

    return sort

def main(mode):
    if mode == "raw":
        tweets = open("data/CoronavirusTweetsRaw", "r", encoding="utf-8") 
        tweetsByLine = tweets.readlines()
        cleanedTweets = []

        counter = 0
        for tweet in tweetsByLine:
            print(counter)
            counter += 1
            current = json.loads(tweet)
            if current["user"] and current["user"]["location"]:
                temp = {}
                temp["alpha2"] = None
                temp["content"] = current["text"] 
                cleanedText = re.sub(
                    r'http\S+', 
                    '', 
                    remove_emoji(current["text"]).replace("#", "").replace("@", "").replace("\n", "").replace(":", "").replace(" - ", " ")
                )
                temp["contentCleaned"] = cleanedText
                temp["date"] = datetime.datetime.strptime(current["created_at"], "%a %b %d %H:%M:%S %z %Y").strftime("%Y-%m-%d")
                temp["label"] = None
                location = current["user"]["location"]
                country = pycountry.countries.get(name = location)
                if country is not None:
                    temp["alpha2"] = country.alpha_2
                    cleanedTweets.append(temp)
                else:
                    geocodeLocation = geoCode(location)
                    if geocodeLocation is not None:
                        country = pycountry.countries.get(name = geocodeLocation.address.split(", ")[-1])
                        if country is not None:
                            temp["alpha2"] = country.alpha_2
                            cleanedTweets.append(temp)

        sortedCleanedTweets = sort(cleanedTweets)

        with open('data/CoronavirusTweets.txt', 'w', encoding='utf-8') as f:
            f.write(json.dumps(sortedCleanedTweets, indent=4, sort_keys=True))
    else:
        with open("data/CoronavirusTweets.txt", "r", encoding="utf-8") as inFile:
            tweets = json.loads(inFile.read()) 

        with open('data/CoronavirusTweets.txt', 'w', encoding='utf-8') as f:
            f.write(json.dumps(tweets, indent=4, sort_keys=True))

# Invoke Main
main(sys.argv[1])
