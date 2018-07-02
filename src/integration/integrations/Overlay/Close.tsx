import * as React from "react";
import { css, cx } from "emotion";

export interface CloseProps {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Close: React.SFC<CloseProps> = ({ onClick }) => {
  return (
    <div className={cx("sj-overlay-close", container)} onClick={onClick}>
      <div className={cx("sj-close", close)}>×</div>
      <div className={cx("sj-esc", esc)}>ESC</div>
    </div>
  );
};

const container = css({
  marginLeft: 16,
  zIndex: 1,
  color: "#aaa",
  textAlign: "center",
  cursor: "pointer",

  "&:hover": {
    color: "#000"
  }
});

const close = css({
  fontSize: 40,
  lineHeight: "30px",
  marginTop: -5
});

const esc = css({
  fontSize: 12,
  marginTop: -5
});
