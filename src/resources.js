import {
  Values,
  valuesChangedEvent,
  Pipeline,
  ClickTracking
} from "sajari-react/controllers";

let pipeline;
let values;
let tracking;

const initialiseResources = (project, collection, pipelineName) => {
  values = new Values();
  tracking = ClickTracking();
  pipeline = new Pipeline(project, collection, pipelineName, values, tracking);

  values.listen(valuesChangedEvent, (changes, set) => {
    if (!changes.page && values.get().page !== "1") {
      set({ page: "1" });
    }
  });
};

export { initialiseResources, pipeline, values, tracking };
