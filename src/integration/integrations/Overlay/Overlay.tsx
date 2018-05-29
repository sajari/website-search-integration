import * as React from "react";
// @ts-ignore: module missing defintion file
import { Overlay as OverlayContainer, Filter } from "sajari-react";
import { css } from "emotion";

import { IIntegrationConfig } from "../../../config";

import { Input } from "../Input";
import { SearchResponse } from "../SearchResponse";

export interface IOverlayProps {
  config: IIntegrationConfig;
  tabsFilter: Filter;
  isActive?: boolean;

  setOverlayControls: (obj: { [k: string]: any }) => { [k: string]: any };
}

export class Overlay extends React.Component<IOverlayProps> {
  public state = { active: false };
  private hide = () => {};

  componentDidMount() {
    const { isActive, setOverlayControls } = this.props;
    this.setState(state => ({ ...state, active: isActive }));

    const controls = setOverlayControls({
      show: () => this.setState({ active: true }),
      hide: () => this.setState({ active: false })
    });

    this.hide = controls.hide;
  }

  render() {
    const { config, tabsFilter } = this.props;
    const { active } = this.state;
    return (
      <OverlayContainer isActive={active} onOuterClick={this.hide}>
        <div>
          <div className="sj-logo" onClick={this.hide} />
          <div>
            <Input config={config} />
          </div>
          {/* <Close onClick={this.hide} closeOverlay={this.hide} /> */}
        </div>
        <div className={css({ height: "calc(100% - 40px)" })}>
          <SearchResponse config={config} tabsFilter={tabsFilter} />
        </div>
      </OverlayContainer>
    );
  }
}
