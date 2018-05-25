import {
  Pipeline,
  Values,
  EVENT_VALUES_UPDATED,
  EVENT_RESPONSE_UPDATED,
  EVENT_SEARCH_SENT,
  EVENT_ANALYTICS_PAGE_CLOSED,
  EVENT_ANALYTICS_BODY_RESET,
  EVENT_ANALYTICS_RESULT_CLICKED,
  EVENT_SELECTION_UPDATED
  // @ts-ignore: module missing defintions file
} from "sajari-react";
import idx from "idx";

import { PubFn, SubFn } from "../../../lib/pubsub";

import {
  INTEGRATION_EVENT_SEARCH_SENT,
  INTEGRATION_EVENT_VALUES_UPDATED,
  INTEGRATION_EVENT_RESPONSE_UPDATED,
  INTEGRATION_EVENT_PAGE_CLOSED,
  INTEGRATION_EVENT_QUERY_RESET,
  INTEGRATION_EVENT_RESULT_CLICKED,
  INTEGRATION_EVENT_SEARCH,
  INTEGRATION_EVENT_OVERLAY_SHOW,
  INTEGRATION_EVENT_OVERLAY_HIDE,
  INTEGRATION_EVENT_VALUES_SET,
  INTEGRATION_EVENT_SEARCH_SEND
} from "../../../events";

export const connectPubSub = (
  pub: PubFn,
  sub: SubFn,
  eventPrefix: string,
  pipeline: Pipeline,
  values: Values,
  connectAnalytics = true
) => {
  pipeline.listen(EVENT_SEARCH_SENT, (values: { [k: string]: string }) => {
    pub(`${eventPrefix}.${INTEGRATION_EVENT_SEARCH_SENT}`, values);
  });
  pipeline.listen(EVENT_RESPONSE_UPDATED, (response: any) => {
    pub(`${eventPrefix}.${INTEGRATION_EVENT_RESPONSE_UPDATED}`, response);
  });

  values.listen(
    EVENT_VALUES_UPDATED,
    (changes: { [k: string]: any }, set: Function) => {
      pub(`${eventPrefix}.${INTEGRATION_EVENT_VALUES_UPDATED}`, changes, set);
    }
  );

  sub(
    `${eventPrefix}.${INTEGRATION_EVENT_VALUES_SET}`,
    (_: any, newValues: { [k: string]: string }) => {
      values.set(newValues);
    }
  );

  sub(`${eventPrefix}.${INTEGRATION_EVENT_SEARCH_SEND}`, () => {
    pipeline.search(values.get());
  });

  // Reset page on search values changed
  values.listen(
    EVENT_VALUES_UPDATED,
    (changes: { [k: string]: any }, set: Function) => {
      // @ts-ignore: idx
      if (!idx(changes, _ => _.page) && values.get().page !== "1") {
        set({ page: "1" });
      }
    }
  );

  if (connectAnalytics) {
    const analytics = pipeline.getAnalytics();
    analytics.listen(EVENT_ANALYTICS_PAGE_CLOSED, (body: any) => {
      pub(`${eventPrefix}.${INTEGRATION_EVENT_PAGE_CLOSED}`, body);
      pub(`${eventPrefix}.${INTEGRATION_EVENT_SEARCH}`, body);
    });
    analytics.listen(EVENT_ANALYTICS_BODY_RESET, (body: any) => {
      pub(`${eventPrefix}.${INTEGRATION_EVENT_QUERY_RESET}`, body);
      pub(`${eventPrefix}.${INTEGRATION_EVENT_SEARCH}`, body);
    });
    analytics.listen(EVENT_ANALYTICS_RESULT_CLICKED, (body: any) => {
      pub(`${eventPrefix}.${INTEGRATION_EVENT_RESULT_CLICKED}`, body);
      pub(`${eventPrefix}.${INTEGRATION_EVENT_SEARCH}`, body);
    });
  }
};
