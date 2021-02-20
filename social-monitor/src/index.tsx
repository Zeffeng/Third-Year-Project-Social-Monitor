import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import './index.css';
import Home from './Pages/Home/Home';
import styled from "styled-components";
import Scripts from './Pages/Scripts/Scripts';
import { createGlobalState } from 'react-hooks-global-state';
import { MapState } from './Types/MapState';
import generateInitialData from "./Components/Map/initialData";

export const Main = styled.div`
    background-color: #212327;
    min-height: 100vh;
`;

const initialState: MapState = {
    CountryData: generateInitialData(),
    TimelineData: [],
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
            <NavigationBar />
            <Switch>
                <Route exact path="/Third-Year-Project-Social-Monitor">
                    <Redirect to="/" />
                </Route>
                <Route path="/" exact>
                    <Home globalState={globalState}/>
                </Route>
                <Route path="/scripts" exact>
                    <Scripts globalState={globalState}/>
                </Route>
            </Switch>   
        </BrowserRouter>
      </Main>
  </React.StrictMode>,
  document.getElementById('root')
);
