import {
  EVENT_ANALYTICS_BODY_RESET,
  EVENT_ANALYTICS_PAGE_CLOSED,
  EVENT_ANALYTICS_RESULT_CLICKED,
  EVENT_RESPONSE_UPDATED,
  EVENT_SEARCH_SENT,
  EVENT_VALUES_UPDATED,
  Pipeline,
  Values
} from "@sajari/sdk-react";
import { Analytics } from "@sajari/sdk-react/dist/controllers";
import get from "dlv";
import PubSubJS from "pubsub-js";
import {
  INTEGRATION_EVENT_PAGE_CLOSED,
  INTEGRATION_EVENT_QUERY_RESET,
  INTEGRATION_EVENT_RESPONSE_UPDATED,
  INTEGRATION_EVENT_RESULT_CLICKED,
  INTEGRATION_EVENT_SEARCH,
  INTEGRATION_EVENT_SEARCH_SEND,
  INTEGRATION_EVENT_SEARCH_SENT,
  INTEGRATION_EVENT_VALUES_SET,
  INTEGRATION_EVENT_VALUES_UPDATED
} from "./events";

export class PubSub {
  private index: number;
  constructor(idx: number) {
    this.index = idx;
  }

  public emit(event: string, ...data: any[]) {
    PubSubJS.publish(`${this.index}.${event}`, ...data);
  }

  public on(event: string, fn: PubSubJS.SubscriptionCallback) {
    if (event === "*") {
      PubSubJS.subscribe(`${this.index}`, fn);
      return;
    }
    PubSubJS.subscribe(`${this.index}.${event}`, fn);
  }

  public connectToPipelineAndValues(name: string, pipeline: Pipeline, values: Values) {
    const pipelineEvents = {
      [EVENT_SEARCH_SENT]: INTEGRATION_EVENT_SEARCH_SENT,
      [EVENT_RESPONSE_UPDATED]: INTEGRATION_EVENT_RESPONSE_UPDATED
    };

    const valuesEvents = {
      [EVENT_VALUES_UPDATED]: INTEGRATION_EVENT_VALUES_UPDATED
    };

    Object.entries(pipelineEvents).forEach(([pe, ie]) => {
      pipeline.listen(pe, (...data) => {
        this.emit(`${name}.${ie}`, ...data);
      });
    });

    Object.entries(valuesEvents).forEach(([ve, ie]) => {
      values.listen(ve, (...data) => {
        this.emit(`${name}.${ie}`, ...data);
      });
    });

    // Reset page on search values changed
    values.listen(
      EVENT_VALUES_UPDATED,
      (
        changes: { [k: string]: any },
        set: (vals: { [k: string]: string }) => void
      ) => {
        if (!get(changes, "page", false) && get(values.get(), "page") !== 1) {
          set({ page: "1" });
        }
      }
    );

    this.on(
      `${name}.${INTEGRATION_EVENT_VALUES_SET}`,
      (_: any, newValues: { [k: string]: string }) => {
        values.set(newValues);
      }
    );

    this.on(`${name}.${INTEGRATION_EVENT_SEARCH_SEND}`, () => {
      pipeline.search(values.get());
    });
  }

  public connectToAnalytics(name: string, analytics: Analytics) {
    const analyticsEvents = {
      [EVENT_ANALYTICS_PAGE_CLOSED]: INTEGRATION_EVENT_PAGE_CLOSED,
      [EVENT_ANALYTICS_BODY_RESET]: INTEGRATION_EVENT_QUERY_RESET,
      [EVENT_ANALYTICS_RESULT_CLICKED]: INTEGRATION_EVENT_RESULT_CLICKED
    };

    Object.entries(analyticsEvents).forEach(([ae, ie]) => {
      analytics.listen(ae, (body: any) => {
        this.emit(`${name}.${ie}`, body);
        this.emit(`${name}.${INTEGRATION_EVENT_SEARCH}`, body);
      });
    });
  }
}
