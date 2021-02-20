import React from "react";
import { GlobalProps } from "../../Types/GlobalProps";
import { CountryCodeData } from "../../Types/MapState";
import { Button, Panel, Slider } from "./TimelineStyles";

interface TimelineProps extends GlobalProps {
    setTimelineValue: Function
}
const Timeline: React.FC<TimelineProps> = (props: TimelineProps) => {
    const { globalState, setTimelineValue } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentDate, setCurrentDate] = React.useState(0);
    const [range, setRange] = React.useState({min: 0, max: 0});

    const dateOptions = {
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
                setCurrentDate(Date.parse(timelineData.slice(-1)[0]["date"] as string))
            }
        }
    }, [range.max, globalState])

    function togglePanel() {
        setIsOpen(!isOpen)
    }

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        const dateUNIX = parseInt(e.target.value)
        setCurrentDate(dateUNIX)
        const timelineData = globalState.get("TimelineData") as CountryCodeData[]
        if (timelineData.length > 0) {
            const date = new Date(dateUNIX).toLocaleDateString("en-US", dateOptions)
            const position = timelineData.map(item => item["date"]).indexOf(date)
            setTimelineValue(position)
        }
    }

    return (
        <Panel open={isOpen}>
            <Button onClick={togglePanel}>Timeline</Button>
            <Slider onChange={event => handleSliderChange(event)} value={currentDate} 
                min={range.min} max={range.max} step={86400} 
                tooltipLabel={(value) => {
                    return new Date(value).toLocaleDateString("en-US", dateOptions)
                }}

            />
        </Panel>
    )
}

export default Timeline;