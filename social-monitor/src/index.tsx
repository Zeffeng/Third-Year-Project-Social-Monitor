import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import './index.css';
import Home from './Pages/Home/Home';
import styled from "styled-components";
import { createGlobalState } from 'react-hooks-global-state';
import { MapState } from './Types/MapState';
import generateInitialData from "./Components/Map/initialData";

export const Main = styled.div`
    background-color: #016DBF;
    min-height: 100vh;
`;

const initialState: MapState = {
    CountryData: generateInitialData(),
    TimelineData: [],
    TimelineNER: {},
    File: undefined
}
const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState(initialState)
const globalState = {
    get: getGlobalState,
    set: setGlobalState,
    use: useGlobalState
}

ReactDOM.render(
  <React.StrictMode>
      <Main>
        <BrowserRouter>
            <NavigationBar globalState={globalState}/>
            <Switch>
                <Route exact path="/Third-Year-Project-Social-Monitor">
                    <Redirect to="/" />
                </Route>
                <Route exact path="/redirect">
                    <Redirect to="/" />
                </Route>
                <Route path="/" exact>
                    <Home globalState={globalState}/>
                </Route>
            </Switch>   
        </BrowserRouter>
      </Main>
  </React.StrictMode>,
  document.getElementById('root')
);
