import React from "react";

import { Overlay as OverlayFrame, Close } from "sajari-react/ui/overlay";
import { AutocompleteInput } from "sajari-react/ui/text";

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
    const { pipeline, values, config, tabsFilter } = this.props;
    return (
      <OverlayFrame active={Boolean(this.state.active)}>
        <div className="sj-logo" onClick={this.hide} />
        <AutocompleteInput
          autoFocus
          pipeline={pipeline}
          values={values}
          placeholder={config.searchBoxPlaceHolder}
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
