import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.module.css';

import * as actions from '../actions';

class App extends Component {
  componentDidMount() {
    this.props.checkAuth();
  }

  render() {
    return (
      <div>
        <div className="container">
        { this.props.children }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuth: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, actions)(App);