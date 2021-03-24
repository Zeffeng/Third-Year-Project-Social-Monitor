import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Scripts from "../Scripts/Scripts";
import { GlobalProps } from "../../Types/GlobalProps";

const NavBar = styled.div`
    background-color: #016DBF;
    opacity: 0.9;
    display: flex;
    align-items: baseline;
    position: fixed;
    width: 20%;
    height: 40px;
    top: 0px;
    z-index: 1;
    padding-left: 15px;
    padding-top: 15px;
    transition: height 0.5s;
    flex-direction: column;
`;

const TitleLink = styled(Link)`
    font-size: 30px;
    color: white;
    text-decoration: none;
`;

const ScriptsButton = styled.button`
    font-size: 25px;
    color: white;
    padding-left: 10px;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    border: none;
`;

const ScriptsDiv = styled.div<{hidden: boolean}>`
    display: flex;
    flex-direction: column;
    visibility: ${props => props.hidden ? "visible" : "hidden"};
`;

interface NavigationBarProps extends GlobalProps {}
const NavigationBar: React.FC<NavigationBarProps> = (props: NavigationBarProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <NavBar>
            <div>
                <TitleLink to="/">Social Monitor</TitleLink>
                <ScriptsButton onClick={() => setIsOpen(!isOpen)}>Scripts</ScriptsButton>
            </div>
            <ScriptsDiv hidden={isOpen}>
                <Scripts globalState={props.globalState}/>
            </ScriptsDiv>
        </NavBar>
    )
}

export default NavigationBar;