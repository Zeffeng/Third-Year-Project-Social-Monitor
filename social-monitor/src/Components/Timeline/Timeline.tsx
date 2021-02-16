import React from "react";
import styled from "styled-components";

const Panel = styled.div<{open: boolean}>`
    background-color: #212327;
    opacity: 0.8;
    color: white;
    font-size: 20px;
    height: ${props => props.open ? "70%": "25px"};
    position: fixed;
    bottom: 0px;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: height 0.5s;
`;

const Button = styled.button`
    width: 100px;
    align-self: center;
    margin-top: 1px;
`;

const Timeline: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    function togglePanel() {
        setIsOpen(!isOpen)
    }

    return (
        <Panel open={isOpen}>
            <Button onClick={togglePanel}>Timeline</Button>
        </Panel>
    )
}

export default Timeline;