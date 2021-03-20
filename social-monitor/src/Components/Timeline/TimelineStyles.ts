import styled from "styled-components";
import RangeSlider from 'react-bootstrap-range-slider';

export const Panel = styled.div<{open: boolean}>`
    background-color: #016DBF;
    opacity: 0.9;
    color: white;
    font-size: 20px;
    height: ${props => props.open ? "40%": "35px"};
    position: fixed;
    bottom: 0px;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: height 0.5s;
    align-items: center;
`;

export const Button = styled.button`
    width: 100px;
    align-self: center;
    margin-top: 1px;
    display: inline-block;
    padding: 6px 0px;
    border: 0.1em solid #FFFFFF;
    border-radius: 0.12em;
    box-sizing: border-box;
    color: #FFFFFF;
    font-family:'Roboto',sans-serif;
    transition: all 0.2s;
    background: transparent;
    &:hover {
        color:#000000;
        background-color:#FFFFFF;
    }
`;

export const Slider = styled(RangeSlider)`
    margin-top: 20px;
    width: 95vw;
    -webkit-appearance: none;
    height: 15px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 0.8;
    -webkit-transition: .2s;
    transition: opacity .2s; 
    ::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    };
    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%; 
        background: #4CAF50;
        cursor: pointer;
    }
`;

export const NERContainer = styled.div`
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
`;