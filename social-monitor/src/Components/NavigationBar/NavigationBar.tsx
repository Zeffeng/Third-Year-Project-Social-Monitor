import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBar = styled.div`
    background-color: transparent;
    display: flex;
    align-items: baseline;
    position: absolute;
    top: 0px;
    z-index: 1;
    padding-left: 15px;
    padding-top: 15px;
`;

const TitleLink = styled(Link)`
    font-size: 25px;
    color: white;
    text-decoration: none;
`;

const SubtitleLink = styled(Link)`
    font-size: 20px;
    color: white;
    padding-left: 10px;
    text-decoration: none;
`;

const NavigationBar: React.FC = () => {
    return (
        <NavBar>
            <TitleLink to="/">Social Monitor</TitleLink>
            <SubtitleLink to="/Scripts">Scripts</SubtitleLink>
        </NavBar>
    )
}

export default NavigationBar;