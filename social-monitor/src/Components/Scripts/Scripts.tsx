import React from 'react'
import { Country } from "../../Types/MapState";
import { GlobalProps } from '../../Types/GlobalProps';
import { useHistory } from 'react-router-dom';

interface ScriptsProps extends GlobalProps {}
const Scripts: React.FC<ScriptsProps> = (props: ScriptsProps) => {
    const [file, setFile] = React.useState<{name: string, content: string}>({name: "", content: ""});
    const { globalState } = props;
    const history = useHistory()

    function callModel() {
        const globalFile = globalState.get("File")
        const localFile = globalFile ? globalFile : file
        fetch('/vader/' + localFile.name.split(".")[0], {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(localFile.content)
        }).then(res => res.json()).then(response => {
            const data = response.slice(-1)[0]
            const countryData = globalState.get("CountryData") as Country[]
            countryData.forEach(item => {
                item.value = data[item.id]
            })
            globalState.set("CountryData", countryData)
            globalState.set("TimelineData", response)
            history.push("/redirect")
        })
    }

    function callNER(preCalc: boolean) {
        const globalFile = globalState.get("File")
        const localFile = globalFile ? globalFile : file
        const preCalculation = preCalc ? "true" : "false"
        fetch('/ner/' + preCalculation, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(localFile.content)
        }).then(res => res.json()).then(response => {
            globalState.set("TimelineNER", response)
        })
    }

    function uploadFile(event: any) {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        const name = event.target.files[0].name
        fileReader.onload = (e) => {
            if (e.target && e.target.result) {
                const file = {name: name, content: JSON.parse(e.target.result as string)}
                setFile(file);
                globalState.set("File", file)
            }
        };
    }

    return (
        <>
            <input type="file" onChange={e => uploadFile(e)} />
            <button onClick={callModel}>Run Vader Model</button>
            <button onClick={() => callNER(false)}>Run Entity Recognition</button>
            <button onClick={() => callNER(true)}>Run Entity Recognition - Pre Calculated</button>
        </>
    )
}

export default Scripts