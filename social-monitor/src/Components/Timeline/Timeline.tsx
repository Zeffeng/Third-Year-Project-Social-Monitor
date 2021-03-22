import React from "react";
import { GlobalProps } from "../../Types/GlobalProps";
import { CountryCodeData, NERTimeline } from "../../Types/MapState";
import { Button, NERContainer, Panel, Slider } from "./TimelineStyles";

interface TimelineProps extends GlobalProps {
    setTimelineValue: Function
}
const Timeline: React.FC<TimelineProps> = (props: TimelineProps) => {
    const { globalState, setTimelineValue } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentDate, setCurrentDate] = React.useState<{unix: number, words: string}>({unix: 0, words: ""});
    const [range, setRange] = React.useState({min: 0, max: 0});

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }

    React.useEffect(() => {
        if (range.max === 0) {
            const timelineData = globalState.get("TimelineData") as CountryCodeData[]
            if (timelineData.length > 0) {
                setRange({
                    max: Date.parse(timelineData.slice(-1)[0]["date"] as string),
                    min: Date.parse(timelineData[0]["date"] as string)
                })
                setCurrentDate({
                    unix: Date.parse(timelineData.slice(-1)[0]["date"] as string),
                    words: ""
                })
            }
        }
    }, [range.max, globalState])

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dateUNIX = parseInt(e.target.value)
        const date = new Date(dateUNIX).toLocaleDateString("en-US", dateOptions)
        setCurrentDate({
            unix: dateUNIX,
            words: date
        })
        const timelineData = globalState.get("TimelineData") as CountryCodeData[]
        if (timelineData.length > 0) {
            const position = timelineData.map(item => item["date"]).indexOf(date)
            setTimelineValue(position)
        }
    }
    
    return (
        <Panel open={isOpen}>
            <Button onClick={() => setIsOpen(!isOpen)}>Timeline</Button>
            <Slider onChange={event => handleSliderChange(event)} value={currentDate.unix} 
                min={range.min} max={range.max} step={86400} 
                tooltipLabel={(value) => {
                    return new Date(value).toLocaleDateString("en-US", dateOptions)
                }}

            />
            <NERContainer>
                {!!globalState.get("TimelineNER") && currentDate.words !== "" ? (globalState.get("TimelineNER") as NERTimeline)[
                    currentDate.words
                ].map(item => {
                    const temp = item.split("<,>")
                    const entity = temp[0]
                    const num = temp[1]
                    return <li>{entity + ": " + num}</li>
                }) : null}
            </NERContainer>
        </Panel>
    )
}

export default Timeline;