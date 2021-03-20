export interface MapState {
    CountryData: Country[],
    TimelineData: CountryCodeData[],
    TimelineNER: NERTimeline,
    File: {name: string, content: string} | undefined
}

export interface Country {
    id: string,
    name: string,
    value: number | null,
    fill: string
}

export interface CountryCodeData {
    [id: string]: number | string | null
}

export interface NERTimeline {
    [id: string]: string[]
}

