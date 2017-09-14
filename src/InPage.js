import React from "react";

import Input from "./Input";

class InPage extends React.Component {
  render() {
    const { pipeline, values, config } = this.props;
    return (
      <div className="sj-inpage">
        <div className="sj-logo" />
        <Input values={values} pipeline={pipeline} config={config} />
      </div>
    );
  }
}

export default InPage;
