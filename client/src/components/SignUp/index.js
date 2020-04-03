import React, { useState } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import { LinkedIn } from "react-linkedin-login-oauth2";
import { Link } from "react-router-dom";
import classes from "./SignUp.module.css";
import Button from "../../components/UI/Button/Button";
import SelectInput from "../UI/Inputs/SelectInput.js";
import { useMediaQuery } from 'react-responsive'

import * as actions from "../../actions";
import CustomInput from "../UI/Inputs/CustomInput.js";
import Toolbar from "../UI/Toolbar";

const options = [
  { label: "CEO", value: "CEO" },
  { label: "CTO", value: "CTO" },
  { label: "Marketeer", value: "Marketeer" },
  { label: "Developer", value: "Developer" }
];

const SignUp = (props) => {

    const isDesktopOrLaptop = useMediaQuery({
      query: '(min-device-width: 1224px)'
    })
    const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isTabletOrMobileDevice = useMediaQuery({
      query: '(max-device-width: 1224px)'
    })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
      
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);

  const onSubmit = async (formData) => {
    await props.signUp({ ...formData, isCompanyType: isBusinessAccount });
    if (!props.errorMessage) {
      props.history.push("/dashboard");
    }
  }

  const responseLinkedin =  async (res) => {
    await props.oauthLinkedin(res.code);
    if (!props.errorMessage) {
      props.history.push("/dashboard");
    }
  }

    const { handleSubmit } = props;

    return (
      <div className={!isTabletOrMobile ? classes.SignUp : classes['SignUp-mobile']}>
      {isTabletOrMobile && <Toolbar/>}
        <div className={!isTabletOrMobile ? classes.SignUp__Info : classes['SignUp__Info-mobile']}>
          {isTabletOrMobile
          ? <h3>TABLET/MOBILE</h3>
          :<b>Company Stories</b>} <p>DESKTOP</p>
          {!isTabletOrMobile && <img />}
        </div>
        <div className={!isTabletOrMobile ? classes.SignUp__Form : classes['SignUp__Form-mobile']}>
          {!isTabletOrMobile && <div className={!isTabletOrMobile ? classes["SignUp__Form--Image"] : classes["SignUp__Form--Image-mobile"]}>
          </div>}
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <Field
                  name="email"
                  type="text"
                  id="email"
                  placeholder={`${isBusinessAccount ? "Company" : ""} E-mail`}
                  component={CustomInput}
                />
              </fieldset>
              <fieldset>
                <Field
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Create Password"
                  component={CustomInput}
                />
              </fieldset>
              {isBusinessAccount && (
                <fieldset style={{marginTop:'1rem'}}>
                  {" "}
                  <Field
                    name="companyRole"
                    id="companyRole"
                    placeholder="Select Company Role"
                    options={options}
                    component={SelectInput}
                    multi
                  />
                </fieldset>
              )}
              {props.errorMessage ? (
                <div className="alert alert-danger">
                  {props.errorMessage}
                </div>
              ) : null}
              <Button type="submit">Sign Up</Button>
              <LinkedIn
                scope="r_liteprofile r_emailaddress"
                clientId="77zasl9w1f82az"
                onFailure={responseLinkedin}
                onSuccess={responseLinkedin}
                redirectUri="<BASEURL>/linkedin"
                renderElement={({ onClick, disabled }) => (
                  <div style={{ position: "relative" }}>
                    <Button
                      btnType="Linkedin"
                      onClick={onClick}
                      disabled={disabled}
                    >
                      <div style={{ position: "absolute", left: "15px" }}>
                      </div>
                      <div>Continue with Linkedin</div>
                    </Button>
                  </div>
                )}
              />
              {!isBusinessAccount && (
                <Button
                  btnType="Success"
                  onClick={() => setIsBusinessAccount(true)}
                >
                  Create a Business Account
                </Button>
              )}
              <div className={classes.CreateAccountText}>
              <p>
              Creating an account means you're ok with {"<COMPANY NAME>"}
                <b> Business Terms of Services and Privacy Police</b>{" "}
              </p>
              <p>
                Already a member?{" "}
                <Link className="nav-link" to="/signin">
                  <b>Sign in now</b>
                </Link>
              </p>
              {isTabletOrMobile && <img className={classes['SideImageLogo-mobile']} />}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signup" })
)(SignUp);
