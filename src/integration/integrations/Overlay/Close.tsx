import { css, cx } from "emotion";
import * as React from "react";

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
  "&:hover": {
    color: "#000"
  },

  color: "#aaa",
  cursor: "pointer",

  marginLeft: 16,
  textAlign: "center",
  zIndex: 1
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
