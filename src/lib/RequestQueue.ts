import Queue, { ProcessFunctionCb } from "better-queue";
import { Dispatch } from "react";
import { ActionType } from "../action/ActionType.enum";
import MemoryStore from "better-queue-memory";

export class RequestQueue {
  private queue: Queue;
  constructor(
    private readonly templates: any[],
    private readonly dispatch: Dispatch<any>
  ) {
    this.queue = new Queue(this.sendRequest, {
      concurrent: 1,
      maxRetries: 0,
      store: new MemoryStore()
    });

    console.log("pushing templates", this.templates);
    this.templates.forEach((template: any) => {
      for (let i = 0; i < template.count; i++) {
        // concanate request number plus template id to avoid merging
        // tasks from different tasks
        this.queue.push({ id: `${i}-${template.id}`, template });
      }
    });
  }

  private sendRequest = async (
    { template }: any,
    cb: ProcessFunctionCb<null>
  ) => {
    this.dispatch({
      type: ActionType.SEND_REQUEST,
      payload: { url: template.url }
    });

    try {
      let initialTime = Date.now();
      let res = await fetch(template.url);

      let finalTime = Date.now();

      let body = await res.text();

      this.dispatch({
        type: ActionType.REQUEST_RETURNED,
        payload: {
          status: res.status,
          url: res.url,
          templateId: template.id,
          body,
          headers: JSON.stringify(res.headers),
          time: finalTime - initialTime
        }
      });
    } catch (e) {
      console.log("request failed", e);
      this.dispatch({ type: ActionType.REQUEST_FAILED, payload: e });
    } finally {
      cb(null, null);
    }
  };
}
