import React from 'react'
import Map from '../../Components/Map/Map';
import styled from "styled-components";
import Timeline from '../../Components/Timeline/Timeline';
import { GlobalProps } from '../../Types/GlobalProps';

const Container= styled.div`
    height: 130vh;
    padding-left: 15px;
`;

interface HomeProps extends GlobalProps {}
const Home: React.FC<HomeProps> = (props: HomeProps) => {
    const [timelineValue, setTimelineValue] = React.useState(0);
    
    return (
        <>
            <Container>
                <Map globalState={props.globalState} timelineValue={timelineValue}/>
            </Container>
            <Timeline globalState={props.globalState} setTimelineValue={setTimelineValue}/>
        </>
    )
}

export default Home