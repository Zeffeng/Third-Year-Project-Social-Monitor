import React from "react";
import { GlobalProps } from "../../Types/GlobalProps";
import { CountryCodeData } from "../../Types/MapState";
import { TimelineValuesState } from "../../Types/TimelineValuesState";
import { Slider, SliderContainer } from "./TimelineStyles";

interface TimelineProps extends GlobalProps {
    setTimelineValues: React.Dispatch<React.SetStateAction<TimelineValuesState>>,
    timelineValues: TimelineValuesState
}
const Timeline: React.FC<TimelineProps> = (props: TimelineProps) => {
    const { globalState, setTimelineValues, timelineValues } = props;
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
                setTimelineValues({
                    timelineIndex: 0,
                    currentDateUnix: Date.parse(timelineData.slice(-1)[0]["date"] as string),
                    currentDateString: ""
                })
            }
        }
    })

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dateUNIX = parseInt(e.target.value)
        const date = new Date(dateUNIX).toLocaleDateString("fr-CA", dateOptions)
        const timelineData = globalState.get("TimelineData") as CountryCodeData[]
        if (timelineData.length > 0) {
            setTimelineValues({
                timelineIndex: timelineData.map(item => item["date"]).indexOf(date),
                currentDateString: date,
                currentDateUnix: dateUNIX
            })
        }
    }
    
    return (
        <SliderContainer>
            <Slider onChange={event => handleSliderChange(event)} value={timelineValues.currentDateUnix} 
                min={range.min} max={range.max} step={86400} 
                tooltipLabel={(value) => {
                    return new Date(value).toLocaleDateString("fr-CA", dateOptions)
                }}
            />
        </SliderContainer>
    )
}

export default Timeline;