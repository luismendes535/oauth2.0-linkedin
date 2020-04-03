import React from "react";
import classes from "./Toolbar.module.css";

const Toolbar = props => (
  <div
    disabled={props.disabled}
    className={classes.Toolbar}
    onClick={props.onClick}
  >
    <div className={classes.Logo}>Logo</div>
    <div className={classes.BurgerMenu}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Toolbar;
