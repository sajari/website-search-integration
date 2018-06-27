import { css } from "emotion";
import * as React from "react";
// @ts-ignore: module missing defintion file
import { Filter, Overlay as OverlayContainer } from "sajari-react";

import { IntegrationConfig } from "../../../config";

import { Input } from "../Input";
import { SearchResponse } from "../SearchResponse";

export interface OverlayProps {
  config: IntegrationConfig;
  tabsFilter: Filter;
  isActive?: boolean;

  setOverlayControls: (obj: { [k: string]: any }) => { [k: string]: any };
}

export class Overlay extends React.Component<OverlayProps> {
  public state = { active: false };

  public componentDidMount() {
    const { isActive, setOverlayControls } = this.props;
    this.setState(state => ({ ...state, active: isActive }));

    const controls = setOverlayControls({
      hide: () => this.setState({ active: false }),
      show: () => this.setState({ active: true })
    });

    this.hide = controls.hide;
  }

  public render() {
    const { config, tabsFilter } = this.props;
    const { active } = this.state;
    return (
      <OverlayContainer isActive={active} onOuterClick={this.hide}>
        <div>
          <div className="sj-logo" onClick={this.hide} />
          <div>
            <Input config={config} autoComplete={true} />
          </div>
          {/* <Close onClick={this.hide} closeOverlay={this.hide} /> */}
        </div>
        <div className={css({ height: "calc(100% - 40px)" })}>
          <SearchResponse config={config} tabsFilter={tabsFilter} />
        </div>
      </OverlayContainer>
    );
  }

  // tslint:disable-next-line
  private hide = () => {};
}
