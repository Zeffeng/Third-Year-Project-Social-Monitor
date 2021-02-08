import React, { useState, useEffect } from 'react'
import { Title } from '../../Styles/TextStyles';
import Map from '../../Components/Map/Map';
import { Main } from "../../Styles/ContainerStyles";

const Home: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
        setCurrentTime(data.time);
        });
    }, []);

    return <Main>
        <Title>
            Social Monitor
        </Title>
        <Map />
        <p>The current time is {currentTime}.</p>
    </Main>
}

export default Home