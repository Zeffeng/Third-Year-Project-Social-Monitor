import React from 'react'
import styled from "styled-components";
import { Country } from "../../Types/MapState";
import { GlobalProps } from '../../Types/GlobalProps';

const Container= styled.div`
    height: 130vh;
    padding-left: 15px;
    padding-top: 50px;
`;

interface ScriptsProps extends GlobalProps {}
const Scripts: React.FC<ScriptsProps> = (props: ScriptsProps) => {
    const [file, setFile] = React.useState<{name: string, content: string}>({name: "", content: ""});
    const { globalState } = props;

    function callModel() {
        fetch('/vader/' + file.name.split(".")[0], {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(file.content)
        }).then(res => res.json()).then(data => {
            const countryData = globalState.get("CountryData") as Country[]
            countryData.forEach(item => {
                item.value = data[item.id]
            })
            globalState.set("CountryData", countryData)
        })
    }

    function uploadFile(event: any) {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        const name = event.target.files[0].name
        fileReader.onload = (e) => {
            if (e.target && e.target.result) {
                setFile({name: name, content: JSON.parse(e.target.result as string)});
            }
        };
    }

    return (
        <Container>
            <button onClick={callModel}>Click for things</button>
            <input type="file" onChange={e => uploadFile(e)} />
        </Container>
    )
}

export default Scripts