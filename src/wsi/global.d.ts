import { Stack } from "@sajari/stack";

declare global {
  interface Window {
    [k: string]: any;
    sajari: {
      ui: Stack[];
    };
  }

  interface Document {
    [k: string]: any;
  }
}
