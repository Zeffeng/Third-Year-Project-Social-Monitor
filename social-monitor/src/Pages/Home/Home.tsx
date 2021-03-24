import React from 'react'
import Map from '../../Components/Map/Map';
import styled from "styled-components";
import Timeline from '../../Components/Timeline/Timeline';
import { GlobalProps } from '../../Types/GlobalProps';
import { TimelineValuesState } from '../../Types/TimelineValuesState';
import NERSidePanel from '../../Components/NERSidePanel/NERSidePanel';

const Container= styled.div`
    height: 130vh;
    padding-left: 15px;
`;

interface HomeProps extends GlobalProps {}
const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const [timelineValues, setTimelineValues] = React.useState<TimelineValuesState>({
        timelineIndex: 0,
        currentDateUnix: 0,
        currentDateString: ""
    });
    
    return (
        <>
            <NERSidePanel globalState={props.globalState} timelineValues={timelineValues}/>
            <Container>
                <Map globalState={props.globalState} timelineValue={timelineValues}/>
            </Container>
            <Timeline globalState={props.globalState} setTimelineValues={setTimelineValues} timelineValues={timelineValues}/>
        </>
    )
}

export default Home