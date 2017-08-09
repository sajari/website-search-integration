import { Values, valuesUpdatedEvent, Pipeline } from "sajari-react/controllers";

let pipeline;
let values;

const initialiseResources = (project, collection, pipelineName, disableGA) => {
  values = new Values();
  pipeline = new Pipeline(
    project,
    collection,
    pipelineName,
    undefined,
    disableGA ? [] : undefined
  );

  values.listen(valuesUpdatedEvent, (changes, set) => {
    if (!changes.page && values.get().page !== "1") {
      set({ page: "1" });
    }
  });
};

export { initialiseResources, pipeline, values };
