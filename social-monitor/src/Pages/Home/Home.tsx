import React from 'react'
import { Title } from '../../Styles/TextStyles';
import Map from '../../Components/Map/Map';
import { Main } from "../../Styles/ContainerStyles";

const Home: React.FC = () => {
    return <Main>
        <Title>
            Social Monitor
        </Title>
        <Map />
    </Main>
}

export default Home