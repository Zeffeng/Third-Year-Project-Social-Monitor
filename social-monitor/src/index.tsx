import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import './index.css';
import Home from './Pages/Home/Home';
import styled from "styled-components";
import Scripts from './Pages/Scripts/Scripts';

export const Main = styled.div`
    background-color: #212327;
    min-height: 100vh;
`;

ReactDOM.render(
  <React.StrictMode>
      <Main>
        <BrowserRouter>
            <NavigationBar />
            <Switch>
                <Route exact path="/Third-Year-Project-Social-Monitor">
                    <Redirect to="/" />
                </Route>
                <Route path="/" component={Home} exact/>
                <Route path="/scripts" component={Scripts} exact/>
            </Switch>   
        </BrowserRouter>
      </Main>
  </React.StrictMode>,
  document.getElementById('root')
);
