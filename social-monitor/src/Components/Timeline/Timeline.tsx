import React from "react";
import styled from "styled-components";

const Panel = styled.div<{open: boolean}>`
    background-color: white;
    opacity: 0.5;
    color: white;
    font-size: 20px;
    height: ${props => props.open ? "100px": "50px"};
    position: absolute;
    bottom: 0px;
    z-index: 1;
    width: 100%;
`;

const Button = styled.button`
    
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