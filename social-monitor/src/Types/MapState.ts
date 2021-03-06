export interface MapState {
    CountryData: Country[],
    TimelineData: CountryCodeData[],
    TimelineNER: NERSentTimeline,
    File: {name: string, content: string} | undefined
}

export interface Country {
    id: string,
    name: string,
    value: number | null,
    fill: string,
    sentimentDistribution: SentimentDistribution
}

export interface CountryCodeData {
    [id: string]: CountrySentimentData | string | null
}

export interface NERTimeline {
    [id: string]: string[]
}

export interface NERSentTimeline {
    [id: string]: { [id: string]: SentimentDistribution }[]
}

export interface CountrySentimentData {
    sentiment: number,
    sentimentDistribution: SentimentDistribution
}
export interface SentimentDistribution {
    neg: number,
    neu: number,
    pos: number
}

