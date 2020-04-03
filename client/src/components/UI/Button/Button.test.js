import { shallow } from "enzyme";
import React from "react";
import Button from "./Button";

it("expect to render Button component", () => {
  expect(shallow(<Button />)).toMatchSnapshot();
});
