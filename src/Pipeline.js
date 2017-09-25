import { Pipeline as SDKPipeline, Values } from "sajari-react/controllers";

class Pipeline {
  constructor(project, collection, name, disableGA) {
    switch (name) {
      case undefined:
        this.empty = true;
        break;
      case "":
        this.dummy = true;
        this.pipeline = new SDKPipeline(project, collection, "", undefined, []);
        break;
      default:
        this.pipeline = new SDKPipeline(
          project,
          collection,
          name,
          undefined,
          disableGA ? [] : undefined
        );
    }
    this.values = new Values();
  }

  isEmpty() {
    return this.empty;
  }

  isDummy() {
    return this.dummy;
  }

  get() {
    return this.pipeline;
  }

  getValues() {
    return this.values;
  }

  /**
   * or returns the calling pipeline if it's not empty and not a dummy
   * otherwise it returns the pipeline supplied as the argument
   * @param {Pipeline} pipeline
   */
  or(pipeline) {
    if (this.isEmpty() || this.isDummy()) {
      return pipeline;
    }
    return this;
  }
}

export default Pipeline;
