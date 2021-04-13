import React from "react";
import { GlobalProps } from "../../Types/GlobalProps";
import { NERSentTimeline } from "../../Types/MapState";
import { TimelineValuesState } from "../../Types/TimelineValuesState";
import SearchBar from "../SearchBar/SearchBar";
import { NERContainer, NERList, Text, Tooltip} from "./NERSidePanelStyles";

interface NERSidePanelProps extends GlobalProps {
    timelineValues: TimelineValuesState
}
const NERSidePanel: React.FC<NERSidePanelProps> = (props: NERSidePanelProps) => {
    const { globalState, timelineValues } = props;
    const [searchTerm, setSearchTerm] = React.useState("");

    return (
        <NERContainer>
            <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
            <NERList>
                {Object.keys(globalState.get("TimelineNER")).length && timelineValues.currentDateString !== "" 
                    ? (globalState.get("TimelineNER") as NERSentTimeline)[timelineValues.currentDateString]
                        .filter(item => {
                            const [key, value] = Object.entries(item)[0]
                            if (searchTerm !== "") {
                                return key.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
                            } else {
                                return true
                            }
                        }).map(item => {
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