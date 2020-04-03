import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header'
import * as actions from '../actions';

class Dashboard extends Component {
  async componentDidMount() {
    this.props.getDashboard()
  }

  render() {
    return (
      <div>
        <Header/>
        This is a Dashboard component
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    secret: state.dash.secret,
    dashboard: state.dash,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Dashboard);
