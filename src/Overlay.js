import React from "react";

import { Overlay as OverlayFrame, Close } from "sajari-react/ui/overlay";

import Input from "./Input";
import SearchResponse from "./SearchResponse";

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: props.active };

    const controls = props.setOverlayControls({
      show: () => this.setState({ active: true }),
      hide: () => this.setState({ active: false })
    });
    this.hide = controls.hide;
  }

  render() {
    const {
      pipeline,
      values,
      config,
      tabsFilter,
      pubSuggestionChosen
    } = this.props;
    return (
      <OverlayFrame active={Boolean(this.state.active)}>
        <div className="sj-logo" onClick={this.hide} />
        <Input
          autoFocus
          pipeline={pipeline}
          values={values}
          config={config}
          pubSuggestionChosen={pubSuggestionChosen}
        />
        <Close onClick={this.hide} closeOverlay={this.hide} />
        <SearchResponse
          config={config}
          tabsFilter={tabsFilter}
          pipeline={pipeline}
          values={values}
        />
      </OverlayFrame>
    );
  }
}

export default Overlay;
