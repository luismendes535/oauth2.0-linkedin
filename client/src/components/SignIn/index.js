import React, { useState } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import { LinkedIn } from "react-linkedin-login-oauth2";
import { Link } from "react-router-dom";
import classes from "./SignIn.module.css";
import Button from "../../components/UI/Button/Button";
import { useMediaQuery } from "react-responsive";
import Toolbar from "../UI/Toolbar";

import * as actions from "../../actions";
import CustomInput from "../UI/Inputs/CustomInput.js";

const SignIn = props => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)"
  });
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isTabletOrMobileDevice = useMediaQuery({
    query: "(max-device-width: 1224px)"
  });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const onSubmit = async formData => {
    await props.signIn(formData);
    if (!props.errorMessage) {
      props.history.push("/dashboard");
    }
  };

  const responseLinkedin = async res => {
    await props.oauthLinkedin(res.code);
    if (!props.errorMessage) {
      props.history.push("/dashboard");
    }
  };

  const { handleSubmit } = props;
  return (
    <div
      className={!isTabletOrMobile ? classes.SignIn : classes["SignIn-mobile"]}
    >
      {isTabletOrMobile && <Toolbar />}
      <div
        className={
          !isTabletOrMobile
            ? classes.SignIn__Info
            : classes["SignIn__Info-mobile"]
        }
      >
        {isTabletOrMobile ? <h3>Tablet/Mobile</h3> : <b>Desktop</b>}{" "}
      </div>
      <div
        className={
          !isTabletOrMobile
            ? classes.SignIn__Form
            : classes["SignIn__Form-mobile"]
        }
      >
        {!isTabletOrMobile && (
          <div
            className={
              !isTabletOrMobile
                ? classes["SignIn__Form--Image"]
                : classes["SignIn__Form--Image-mobile"]
            }
          >
          </div>
        )}
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <Field
                name="email"
                type="text"
                id="email"
                placeholder="E-mail"
                component={CustomInput}
              />
            </fieldset>
            <fieldset>
              <Field
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                component={CustomInput}
              />
            </fieldset>
            {props.errorMessage ? (
              <div className="alert alert-danger">{props.errorMessage}</div>
            ) : null}
          </form>
          <Button type="submit">Sign In</Button>
        </div>
        <LinkedIn
          scope="r_liteprofile r_emailaddress"
          clientId="77zasl9w1f82az"
          onFailure={responseLinkedin}
          onSuccess={responseLinkedin}
          redirectUri="<BASEURL>/linkedin" 
          renderElement={({ onClick, disabled }) => (
            <div style={{ position: "relative" }}>
              <Button btnType="Linkedin" onClick={onClick} disabled={disabled}>
                <div style={{ position: "absolute", left: "15px" }}>
                </div>
                <div>Log in with Linkedin</div>
              </Button>
            </div>
          )}
        />{" "}
        <div className={classes.CreateAccountText}>
          <p>
            Need an account?{" "}
            <Link className="nav-link" to="/signup">
              <b>Sign up now</b>
            </Link>
          </p>
          {isTabletOrMobile && (
            <img
              className={classes["SideImageLogo-mobile"]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signin" })
)(SignIn);
