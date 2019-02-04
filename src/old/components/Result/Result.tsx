import { TokenLink } from "@sajari/sdk-react";
import get from "dlv";
import { css, cx } from "emotion";
import { withTheme } from "emotion-theming";
import * as React from "react";
import parse from "date-fns/parse";
import format from "date-fns/format";

import { Image } from "./Image";

const defaultPublishedDatetimeField = "published_time";

export interface ResultProps {
  token: string;
  values: { [k: string]: string | string[] };
  resultClicked: (url: string) => void;
  score?: number;
  indexScore?: number;
  showImage?: boolean;
  itemIndex?: number;

  fallbackImageURL?: string;
  renderPublishedTime?: boolean;
  publishedDatetimeField?: string;

  theme?: any;
  styles?: ResultStyles | null;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  imageClassName?: string;
  urlClassName?: string;
}

export interface ResultStyles {
  container?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
  url?: React.CSSProperties;
}

export class Result extends React.Component<ResultProps> {
  public render() {
    const {
      token,
      values,
      resultClicked,
      showImage = false,
      fallbackImageURL,
      renderPublishedTime,
      publishedDatetimeField = defaultPublishedDatetimeField,
      theme
    } = this.props;
    let styles = this.props.styles;
    if (styles === null || styles === undefined) {
      styles = {};
    }

    const title = values.title;
    const description = values.description;
    const url = values.url;
    let img = values.image || "";
    if (img === "" && fallbackImageURL != undefined) {
      img = fallbackImageURL;
    }
    let publishedTime = undefined;
    if (renderPublishedTime) {
      publishedTime = get(values, publishedDatetimeField, undefined);
      if (publishedTime != undefined) {
        publishedTime = parse(publishedTime);
        publishedTime = format(publishedTime, "dddd, MMM DD, YYYY");
      }
    }

    const classNames = {
      container: cx(
        "sj-results__result",
        this.props.className,
        css(resultStyles.container),
        showImage && css({ flexDirection: "row" }),
        styles && styles.container && css(styles.container as any)
      ),
      img: cx(this.props.imageClassName, css({ display: "inline-block" })),
      title: cx(
        "sj-results__result__title",
        this.props.titleClassName,
        css(resultStyles.title),
        styles && styles.title && css(styles.title as any),
        themeColor(theme),
        css({ "&:hover": themeColor(theme) })
      ),
      description: cx(
        "sj-results__result__description",
        this.props.descriptionClassName,
        css(resultStyles.description),
        styles && styles.description && css(styles.description as any)
      ),
      url: cx(
        "sj-result__result__link",
        this.props.urlClassName,
        css(resultStyles.link),
        styles && styles.url && css(styles.url as any),
        css({ "&:hover": themeColor(theme) })
      )
    };

    return (
      <div className={classNames.container}>
        {showImage && (
          <Image className={classNames.img} src={img as string} alt={""} />
        )}
        <div className="sj-result__text">
          <TokenLink
            url={url as string}
            token={token}
            resultClicked={resultClicked}
            className={classNames.title}
          >
            <h3>{title}</h3>
          </TokenLink>
          <p className={classNames.description}>
            {publishedTime && (
              <span className={css(resultStyles.extra)}>
                {publishedTime}
                <br />
              </span>
            )}
            {description}
          </p>
          <TokenLink
            url={url as string}
            token={token}
            resultClicked={resultClicked}
            className={classNames.url}
          >
            {url}
          </TokenLink>
        </div>
      </div>
    );
  }
}

export default withTheme(Result);

const resultStyles = {
  container: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    display: "inline-block",
    width: "100%",
    color: "#383b48",
    "&:hover": {
      color: "#383b48"
    },
    "& > h3": {
      fontSize: "1.1em",
      lineHeight: 1.3,
      fontWeight: 400,
      marginBottom: 0,
      marginTop: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  },
  extra: {
    color: "#444"
  },
  description: {
    fontSize: "0.85em",
    lineHeight: 1.69,
    marginBottom: 0,
    marginTop: 0,
    overflowWrap: "break-word",
    wordWrap: "break-word"
  },
  link: {
    display: "inline-block",
    width: "100%",
    fontSize: "0.75em",
    color: "#888991",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    "&:hover": {
      color: "#22232b"
    }
  }
} as { [k: string]: any };

function themeColor(theme?: any): string {
  return css({
    color: get(theme, "colors.brand.primary", "inherit")
  });
}
