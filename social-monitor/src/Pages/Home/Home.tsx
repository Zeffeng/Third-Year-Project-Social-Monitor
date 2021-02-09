import React from 'react'
import Map from '../../Components/Map/Map';
import styled from "styled-components";
import Timeline from '../../Components/Timeline/Timeline';

export const Container= styled.div`
    height: 100vh;
    padding-left: 15px;
`;

const Home: React.FC = () => {

    return (
        <>
            <Container>
                <Map />
            </Container>
            <Timeline />
        </>
    )
}

export default Home