import React from 'react'
import { Country, CountryCodeData, CountrySentimentData, NERSentTimeline, NERTimeline, SentimentDistribution } from "../../Types/MapState";
import { GlobalProps } from '../../Types/GlobalProps';
import { useHistory } from 'react-router-dom';
import styled from "styled-components";

const Button = styled.button`
    margin-top: 3px;
    border-radius: 5px;
    border: none;
    background-color: #B7C0EE;
    color: #011638;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    :hover:enabled {
        background-color: #8B9AE4
    };
    :disabled {
        opacity: 0.3
        
    }
`;

const Label = styled.label`
    border-radius: 5px;
    border: none;
    background-color: #B7C0EE;
    color: #011638;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    :hover {
        background-color: #8B9AE4
    }
`;

const Input = styled.input`
    display: none;
`;

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
            const data = response.slice(-1)[0] as CountryCodeData
            const countryData = globalState.get("CountryData") as Country[]
            countryData.forEach(item => {
                const countryDataFromResponse = data[item.id]
                if (countryDataFromResponse !== undefined) {
                    if (countryDataFromResponse !== null) {
                        item.value = (countryDataFromResponse as CountrySentimentData).sentiment
                        item.sentimentDistribution = (countryDataFromResponse as CountrySentimentData).sentimentDistribution
                    } else {
                        item.value = null
                    }
                }
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
        fetch('/ner?preCalc=' + preCalculation + '&name=' + localFile.name.split(".")[0], {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(localFile.content)
        }).then(res => res.json()).then(response => {
            var cleanData: NERSentTimeline = {}
            Object.entries((response as NERTimeline)).forEach(([key, value]) => {
                var temp: { [id: string]: SentimentDistribution}[] = []
                var doesExist: {[id: string]: number} = {}
                value.forEach(val => {
                    const string = val.split("<,>")[0]
                    const entity = string.split("||")[0]
                    const sentiment = string.split("||")[1]
                    const count = val.split("<,>")[1]
                    if (doesExist[entity] !== undefined) {
                        const i = doesExist[entity]
                        const [entryKey, entrySent] = Object.entries(temp[i])[0]
                        switch (sentiment) {
                            case "-1":
                                temp[i] = { 
                                    [entryKey]: {
                                        neg: parseInt(count) + entrySent.neg,
                                        neu: entrySent.neu,
                                        pos: entrySent.pos
                                    }
                                };
                                break;
                            case "0":
                                temp[i] = { 
                                    [entryKey]: {
                                        neg: entrySent.neg,
                                        neu: parseInt(count) + entrySent.neu,
                                        pos: entrySent.pos
                                    }
                                };
                                break;
                            case "1":
                                temp[i] = { 
                                    [entryKey]: {
                                        neg: entrySent.neg,
                                        neu: entrySent.neu,
                                        pos: parseInt(count) + entrySent.pos
                                    }
                                };
                                break;
                        }
                    } else {
                        doesExist[entity] = temp.length;
                        switch (sentiment) {
                            case "-1":
                                temp.push({
                                    [entity]: {
                                        neg: parseInt(count),
                                        neu: 0,
                                        pos: 0
                                    }
                                })
                                break;
                            case "0":
                                temp.push({
                                    [entity]: {
                                        neg: 0,
                                        neu: parseInt(count),
                                        pos: 0
                                    }
                                });
                                break;
                            case "1":
                                temp.push({
                                    [entity]: {
                                        neg: 0,
                                        neu: 0,
                                        pos: parseInt(count)
                                    }
                                });
                                break;
                        }
                        
                    }
                })
                cleanData[key] = temp
            })
            globalState.set("TimelineNER", cleanData)
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
            <Input type="file" id="file" onChange={e => uploadFile(e)} />
            <Label htmlFor="file">Upload File</Label>
            <Button disabled={file.name === ""} onClick={callModel}>Run Vader Model</Button>
            <Button disabled={file.name === ""} onClick={() => callNER(false)}>Run Entity Recognition</Button>
            <Button disabled={file.name === ""} onClick={() => callNER(true)}>Run Entity Recognition - Pre Calculated</Button>
        </>
    )
}

export default Scripts