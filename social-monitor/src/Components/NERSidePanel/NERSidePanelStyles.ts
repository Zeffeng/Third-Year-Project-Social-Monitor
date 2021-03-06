import styled from "styled-components";

export const NERContainer = styled.div`
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    right: 0px;
    border: black solid 1px;
    width: 16vw;
    color: white;
    padding: 5px;
`;

export const Tooltip = styled.div`
    position: relative;
`;

export const Text = styled.span`
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;

    ${Tooltip}:hover &{
        visibility: visible
    }
`;

export const NERList = styled.div`
    padding: 10px 0px 0px 0px
`;
