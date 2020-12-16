import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home/Home';
import { Main } from './Styles/ContainerStyles';

ReactDOM.render(
  <React.StrictMode>
      <Main>
      <BrowserRouter>
        <Switch>
            <Route path="/" component={Home} exact />
        </Switch>   
      </BrowserRouter>
      </Main>
  </React.StrictMode>,
  document.getElementById('root')
);
