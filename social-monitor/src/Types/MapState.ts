export interface MapState {
    CountryData: Country[]
}

export interface Country {
    id: string,
    name: string,
    value: number | null,
    fill: string
}