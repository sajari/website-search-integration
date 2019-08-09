/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";

export interface CloseProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Close: React.SFC<CloseProps> = ({ onClick }) => {
  return (
    <div className={"sj-overlay-close"} css={container} onClick={onClick}>
      <div className="sj-close">
        <Cross />
      </div>
      <div className={"sj-esc"} css={esc}>
        ESC
      </div>
    </div>
  );
};

const Cross: React.SFC = props => (
  <svg viewBox="0 0 14 14" fill="none" width="1em" height="1em" {...props}>
    <path
      d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41z"
      fill="currentcolor"
    />
  </svg>
);

const container = css({
  "&:hover": {
    color: "#000"
  },

  color: "#aaa",
  cursor: "pointer",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  marginLeft: 16,
  textAlign: "center",
  zIndex: 1
});

const esc = css({
  fontSize: 12,
  lineHeight: 1
});
