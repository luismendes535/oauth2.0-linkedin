import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Header extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.signOut();
  }

  render() {
    return (
      <nav style={{ marginBottom: '30px' }}>
        <Link to="/">OAuth 2.0</Link>

        <div>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>

          <ul>
            { !this.props.isAuth ?
              [<li key="signup">
                <Link to="/signup">Sign Up</Link>
              </li>,
              <li key="signin">
                <Link to="/signin">Sign In</Link>
              </li>] : null }
            
            { this.props.isAuth ?
              <li>
                <Link to="/signout" onClick={this.signOut}>Sign Out</Link>
              </li> : null }
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuth: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, actions)(Header);


