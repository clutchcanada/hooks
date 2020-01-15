import React from "react";
import * as R from "ramda";

const withProvider = R.curry((Provider, Component, props) => (
  <Provider>
    <Component {...props} />
  </Provider>
));

export default withProvider;
