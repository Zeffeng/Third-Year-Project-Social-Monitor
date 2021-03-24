import styled from "styled-components";
import RangeSlider from 'react-bootstrap-range-slider';

export const Slider = styled(RangeSlider)`
    margin-top: 20px;
    width: 79vw;
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

export const SliderContainer = styled.div`
    position: fixed;
    bottom: 8px;
    margin-left: 30px;
    .range-slider__wrap {
        .range-slider__tooltip {
            display: flex;
            justify-content: end;
            color: white;
            font-size: 20px;
        }
    }
`;
