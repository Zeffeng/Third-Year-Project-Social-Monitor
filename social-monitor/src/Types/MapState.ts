export interface MapState {
    CountryData: Country[],
    TimelineData: CountryCodeData[]
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