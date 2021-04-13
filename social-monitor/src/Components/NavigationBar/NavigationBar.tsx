import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Scripts from "../Scripts/Scripts";
import { GlobalProps } from "../../Types/GlobalProps";
import Modal from "react-modal"

const NavBar = styled.div`
    background-color: #016DBF;
    opacity: 0.9;
    display: flex;
    align-items: baseline;
    position: fixed;
    width: 30%;
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
    color: #01183C;
    text-decoration: none;
    font-weight: 600;
`;

const SubtitleButton = styled.button`
    font-size: 25px;
    color: #01183C;
    padding-left: 10px;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    border: none;
    font-weight: 600;
`;

const ScriptsDiv = styled.div<{hidden: boolean}>`
    display: flex;
    flex-direction: column;
    visibility: ${props => props.hidden ? "visible" : "hidden"};
`;

interface NavigationBarProps extends GlobalProps {}
const NavigationBar: React.FC<NavigationBarProps> = (props: NavigationBarProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)',
            width: "40%",
            height: "40%",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        } as React.CSSProperties,
        overlay: {
            backgroundColor: "transparent"
        }
    };

    return (
        <NavBar>
            <div>
                <TitleLink to="/">Social Monitor</TitleLink>
                <SubtitleButton onClick={() => setIsOpen(!isOpen)}>Scripts</SubtitleButton>
                <SubtitleButton onClick={() => setIsModalOpen(true)}>Help</SubtitleButton>
            </div>
            <ScriptsDiv hidden={isOpen}>
                <Scripts globalState={props.globalState}/>
            </ScriptsDiv>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={customStyles}>
                To use this tool you must first acquire a data set. You will need python installed, and a set of twitter API credentials, the steps of which are: <br/><br/> 
                1) With the scrapeIds file obtained run the file with arguments:<br/>
                Desired search hashtag <br/>
                Output file name<br />
                Start date in format yyyy-mm-dd<br/>
                Number of months to run for<br/> <br />
                2) Then to hydrate the tweets run (get_metadata.py should be acquired from SMMT, api_keys.json should be your twitter api keys): <br/>
                python get_metadata.py -i "Input file name" -o "output file name" -k api_keys.json <br/> <br/>
                4) Then simply run the preProcess.py file with the parameters "raw" and the input file name <br/> <br/>
                3) The resulting file can then be used in the site <br/> <br/>

                If you don't have python or twitter api keys then I have provided an example dataset in my <a href="https://github.com/Zeffeng/Third-Year-Project-Social-Monitor">GitHub</a><br/><br/>

                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </Modal>
        </NavBar>
    )
}

export default NavigationBar;