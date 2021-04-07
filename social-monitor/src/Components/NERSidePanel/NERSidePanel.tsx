import React from "react";
import { GlobalProps } from "../../Types/GlobalProps";
import { NERSentTimeline } from "../../Types/MapState";
import { TimelineValuesState } from "../../Types/TimelineValuesState";
import { NERContainer, NERList, Text, Tooltip} from "./NERSidePanelStyles";

interface NERSidePanelProps extends GlobalProps {
    timelineValues: TimelineValuesState
}
const NERSidePanel: React.FC<NERSidePanelProps> = (props: NERSidePanelProps) => {
    const { globalState, timelineValues } = props;
    
    return (
        <NERContainer>
            Named Enities
            <NERList>
                {Object.keys(globalState.get("TimelineNER")).length && timelineValues.currentDateString !== "" 
                    ? (globalState.get("TimelineNER") as NERSentTimeline)[timelineValues.currentDateString]
                        .map(item => {
                            const [key, value] = Object.entries(item)[0]
                            const entity = key
                            const totalCount = value.neg + value.neu + value.pos
                            return (
                                <Tooltip>{entity + ": " + totalCount}
                                    <Text key={entity}>Postive: {value.pos + "\n"} Neutral: {value.neu + "\n"} Negative: {value.neg + "\n"}</Text>
                                </Tooltip>
                            )
                        }) 
                    : null}
            </NERList>
        </NERContainer>
    )
}

export default NERSidePanel;