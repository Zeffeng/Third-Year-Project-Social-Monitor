import React from "react";
import styled from "styled-components"
import { GlobalProps } from "../../Types/GlobalProps";
import { NERTimeline } from "../../Types/MapState";
import { TimelineValuesState } from "../../Types/TimelineValuesState";

const NERContainer = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    right: 0px;
    border: black solid 1px;
    z-index: 1;
    width: 256px;
    color: white;
`;

interface NERSidePanelProps extends GlobalProps {
    timelineValues: TimelineValuesState
}
const NERSidePanel: React.FC<NERSidePanelProps> = (props: NERSidePanelProps) => {
    const { globalState, timelineValues } = props;
    
    return (
        <NERContainer>
            Named Enities
            <ol>
                {Object.keys(globalState.get("TimelineNER")).length && timelineValues.currentDateString !== "" ? (globalState.get("TimelineNER") as NERTimeline)[
                    timelineValues.currentDateString
                ].map(item => {
                    const temp = item.split("<,>")
                    const entity = temp[0]
                    const num = temp[1]
                    if (parseInt(num) > 1) {
                        return <li>{entity + ": " + num}</li>
                    }
                }) : null}
            </ol>
        </NERContainer>
    )
}

export default NERSidePanel;