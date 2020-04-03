import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import Home from './components/Home';
import SignUp from './components/SignUp/index';
import SignIn from './components/SignIn/index';
import Dashboard from './components/Dashboard';
import reducers from './reducers';

import authGuard from './components/HOCs/authGuard';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';

axios.defaults.withCredentials = true;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
  1) Disable the httpOnly property :(
  2) Fire off a request on app load to the BE which will check if the user is auth-ed
*/

ReactDOM.render(
  <Provider store={createStore(reducers, {}, composeEnhancers(applyMiddleware(reduxThunk)))}>
    <BrowserRouter>
      <App>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/linkedin" component={LinkedInPopUp} />
        <Route exact path="/dashboard" component={authGuard(Dashboard)} />
      </App>
    </BrowserRouter>
  </Provider>, 
  document.querySelector('#root'));
registerServiceWorker();
