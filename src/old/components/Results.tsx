import { ResultsContainer } from "@sajari/sdk-react";
import get from "dlv";
import merge from "deepmerge";
import isPlainObject from "is-plain-object";
import { css } from "emotion";
import * as React from "react";
import { Result } from "./Result";

const listStyles = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  overflow: "auto"
};

const itemStyles = {
  marginBottom: "1.5em",
  "&:last-of-type": {
    marginBottom: "0.5em"
  }
};

export interface ResultsProps {
  config: { [k: string]: any };
}

export const Results: React.SFC<ResultsProps> = props => {
  const { config } = props;
  const showImages = get(config, "results.showImages", undefined);
  const renderPublishedTime = get(config, "results.showPublishedDate");
  const publishedDateField = get(config, "results.publishedDateField");

  const resultRenderOptions = get(
    config,
    "render.components.result",
    undefined
  );
  let fields: { [k: string]: string } | undefined;
  let classNames: { [k: string]: string } = {};
  let fallbackImageURL: string | undefined;
  if (resultRenderOptions !== undefined) {
    fields = getComponentProperties(resultRenderOptions, "field");
    classNames = getComponentProperties(resultRenderOptions, "class");
    fallbackImageURL = get(
      getComponentProperties(resultRenderOptions, "fallback"),
      "image",
      undefined
    );
  }

  let resultsStyles = merge(
    { container: listStyles, item: itemStyles },
    get(config, "styling.components.results", {}),
    {
      isMergeableObject: isPlainObject
    }
  );

  return (
    <ResultsContainer fields={fields}>
      {({ error, results }) => {
        if (error) {
          return error.message;
        }
        if (results === undefined || results.length === 0) {
          return null;
        }
        return (
          <ol className={css(resultsStyles.container)}>
            {results.map(result => {
              return (
                <li key={result.key} className={css(resultsStyles.item)}>
                  <Result
                    values={result.values}
                    token={result.token}
                    resultClicked={result.resultClicked}
                    showImage={showImages}
                    fallbackImageURL={fallbackImageURL}
                    renderPublishedTime={renderPublishedTime}
                    publishedDatetimeField={publishedDateField}
                    styles={get(resultsStyles, "result", undefined)}
                    titleClassName={get(classNames, "title", undefined)}
                    descriptionClassName={get(
                      classNames,
                      "description",
                      undefined
                    )}
                    urlClassName={get(classNames, "url", undefined)}
                  />
                </li>
              );
            })}
          </ol>
        );
      }}
    </ResultsContainer>
  );
};

function getComponentProperties(
  component: {
    [k: string]: any;
  },
  field: string
): { [k: string]: string } {
  return Object.keys(component).reduce(
    (props, key) => {
      const value = get(component[key], field, null);
      if (value === null) {
        return props;
      }
      props[key] = value;
      return props;
    },
    {} as { [k: string]: string }
  );
}
