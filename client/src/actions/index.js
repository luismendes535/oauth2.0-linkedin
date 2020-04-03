import axios from 'axios';
import { 
  AUTH_SIGN_UP, 
  AUTH_SIGN_OUT, 
  AUTH_SIGN_IN,
  AUTH_LINK_LINKEDIN, 
  AUTH_UNLINK_LINKEDIN,
  AUTH_ERROR,
  DASHBOARD_GET_DATA } from './types';

export const oauthLinkedin = data => {
  return async dispatch => {
    await axios.post('<BASEURL>/users/oauth/linkedin', {
      access_token: data
    });

    dispatch({
      type: AUTH_SIGN_UP
    });
  };
}

export const linkLinkedin = data => {
  return async dispatch => {
    const res = await axios.post('<BASEURL>/users/oauth/link/linkedin', {
      access_token: data
    });

    dispatch({
      type: AUTH_LINK_LINKEDIN,
      payload: res.data
    });
  };
}

export const unlinkLinkedin = data => {
  return async dispatch => {
    const res = await axios.post('<BASEURL>/users/oauth/unlink/linkedin');

    dispatch({
      type: AUTH_UNLINK_LINKEDIN,
      payload: res.data
    });
  };
}

export const signUp = data => {
  return async dispatch => {
    try {
      await axios.post('<BASEURL>/users/signup', data);

      dispatch({
        type: AUTH_SIGN_UP
      });
    } catch(err) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Email is already in use'
      })
    }
  };
}

export const signIn = data => {
  return async dispatch => {
    try {
      await axios.post('<BASEURL>/users/signin', data);

      dispatch({
        type: AUTH_SIGN_IN
      });
    } catch(err) {
      dispatch({
        type: AUTH_ERROR,
        payload: 'Email and password combination isn\'t valid'
      })
    }
  };
}

export const checkAuth = () => {
  return async dispatch => {
    try {
      await axios.get('<BASEURL>/users/status');

      dispatch({
        type: AUTH_SIGN_IN
      });

      console.log('user is auth-ed')
    } catch(err) {
      console.log('error', err)
    }
  };
}

export const getDashboard = () => {
  return async dispatch => {
    try {
      const res = await axios.get('<BASEURL>/users/dashboard')

      dispatch({
        type: DASHBOARD_GET_DATA,
        payload: res.data
      })

    } catch(err) {
      console.error('err', err)
    }
  }
}

export const signOut = () => {
  return async dispatch => {
    await axios.get('<BASEURL>/users/signout');

    dispatch({
      type: AUTH_SIGN_OUT
    })
  };
}
